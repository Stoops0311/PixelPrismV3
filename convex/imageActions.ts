"use node"

import { internalAction } from "./_generated/server"
import { internal } from "./_generated/api"
import { v } from "convex/values"
import { UTApi } from "uploadthing/server"

const POLL_INTERVAL_MS = 2000
const MAX_POLL_DURATION_MS = 5 * 60 * 1000 // 5 minutes
const RETRY_DELAY_MS = 5000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const generate = internalAction({
  args: { imageId: v.id("generatedImages") },
  handler: async (ctx, args) => {
    // Read the image record
    const image = await ctx.runQuery(internal.images.getInternal, {
      imageId: args.imageId,
    })
    if (!image) {
      throw new Error("Image record not found")
    }

    if (image.status !== "generating") {
      return // Already completed or failed
    }

    const apiToken = process.env.REPLICATE_API_TOKEN
    if (!apiToken) {
      // Refund credits then mark failed
      await ctx.runMutation(internal.credits.refundInternal, {
        userId: image.userId,
        amount: image.creditsUsed,
        generatedImageId: args.imageId,
        description: "Refund for failed generation",
      })
      await ctx.runMutation(internal.images.markFailed, {
        imageId: args.imageId,
        errorMessage:
          "Image generation service is not configured. Please contact support.",
        refunded: true,
      })
      return
    }

    // Get first reference image URL (used by Qwen model)
    const referenceImageUrl =
      image.referenceImageUrls && image.referenceImageUrls.length > 0
        ? image.referenceImageUrls[0]
        : undefined

    // Build model input based on model type
    const isSeedream =
      image.model === "bytedance/seedream-4.5" ||
      image.model === "bytedance/seedream-4"

    let input: Record<string, any>
    if (isSeedream) {
      input = {
        prompt: image.fullPrompt,
        aspect_ratio: image.aspectRatio,
        size: "2K",
      }
      if (image.seed !== undefined) {
        input.seed = image.seed
      }
      if (image.referenceImageUrls && image.referenceImageUrls.length > 0) {
        input.image_input = image.referenceImageUrls
      }
    } else {
      // qwen model
      input = {
        prompt: image.fullPrompt,
        aspect_ratio: image.aspectRatio,
        output_format: "webp",
      }
      if (image.seed !== undefined) {
        input.seed = image.seed
      }
      if (referenceImageUrl) {
        input.image = referenceImageUrl
      }
    }

    console.log(`[imageActions.generate] Starting generation for image ${args.imageId}, model: ${image.model}, aspect: ${image.aspectRatio}`)

    try {
      // Create prediction via model-specific endpoint
      const createResponse = await fetch(
        `https://api.replicate.com/v1/models/${image.model}/predictions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
            Prefer: "wait",
          },
          body: JSON.stringify({ input }),
        }
      )

      if (!createResponse.ok) {
        const errorBody = await createResponse.text()
        throw new Error(
          `Replicate API error (${createResponse.status}): ${errorBody}`
        )
      }

      const prediction = await createResponse.json()
      const predictionId = prediction.id

      // Poll for completion
      const startTime = Date.now()
      while (Date.now() - startTime < MAX_POLL_DURATION_MS) {
        await sleep(POLL_INTERVAL_MS)

        const pollResponse = await fetch(
          `https://api.replicate.com/v1/predictions/${predictionId}`,
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
          }
        )

        if (!pollResponse.ok) {
          const errorBody = await pollResponse.text()
          throw new Error(
            `Replicate poll error (${pollResponse.status}): ${errorBody}`
          )
        }

        const result = await pollResponse.json()

        if (result.status === "succeeded") {
          // Extract output URL - can be array or single string
          const output = result.output
          let replicateUrl: string
          if (Array.isArray(output)) {
            replicateUrl = output[0]
          } else {
            replicateUrl = output
          }

          // Upload to UploadThing for permanent CDN storage
          let permanentUrl = replicateUrl
          try {
            const utToken = process.env.UPLOADTHING_TOKEN
            if (utToken) {
              const utapi = new UTApi({ token: utToken })
              const uploaded = await utapi.uploadFilesFromUrl({
                url: replicateUrl,
                name: `pixelprism-${args.imageId}.webp`,
              })
              if (uploaded.data?.ufsUrl) {
                permanentUrl = uploaded.data.ufsUrl
              } else {
                console.error("[imageActions.generate] UploadThing upload failed, using Replicate URL as fallback:", uploaded.error)
              }
            } else {
              console.warn("[imageActions.generate] UPLOADTHING_TOKEN not set, using Replicate URL (expires in 24h)")
            }
          } catch (utError: any) {
            console.error("[imageActions.generate] UploadThing upload error, using Replicate URL as fallback:", utError.message)
          }

          await ctx.runMutation(internal.images.markComplete, {
            imageId: args.imageId,
            imageUrl: permanentUrl,
            replicateOutputUrls: Array.isArray(output) ? output : [output],
          })
          return
        }

        if (result.status === "failed" || result.status === "canceled") {
          const errorMsg = result.error || "Unknown generation error"
          throw new Error(errorMsg)
        }

        // Still processing, continue polling
      }

      // Timed out
      throw new Error("TIMEOUT")
    } catch (error: any) {
      const errorMessage = error.message || "Unknown error"
      console.error(`[imageActions.generate] Failed for image ${args.imageId}:`, errorMessage)

      // Check if this is an NSFW content filter error
      const isNSFW =
        errorMessage.toLowerCase().includes("nsfw") ||
        errorMessage.toLowerCase().includes("safety") ||
        errorMessage.toLowerCase().includes("content policy")

      // Check for OOM errors
      const isOOM =
        errorMessage.toLowerCase().includes("out of memory") ||
        errorMessage.toLowerCase().includes("oom")

      // Check for timeout
      const isTimeout = errorMessage === "TIMEOUT"

      // Determine if we should retry
      const canRetry = image.retryCount < 1 && !isNSFW

      if (canRetry) {
        // Increment retry count and reschedule
        await ctx.runMutation(internal.images.incrementRetry, {
          imageId: args.imageId,
        })

        await ctx.scheduler.runAfter(
          RETRY_DELAY_MS,
          internal.imageActions.generate,
          { imageId: args.imageId }
        )
        return
      }

      // No more retries — determine user-facing error message
      let userMessage: string
      if (isTimeout) {
        userMessage =
          "Generation timed out after 5 minutes. Try a simpler prompt or lower resolution."
      } else if (isNSFW) {
        userMessage =
          "Generation blocked by content safety filter. Please modify your prompt."
      } else if (isOOM) {
        userMessage =
          "Generation failed due to insufficient memory. Try a lower resolution."
      } else {
        userMessage =
          "Image generation failed. Your credits have been refunded."
      }

      // Refund credits
      await ctx.runMutation(internal.credits.refundInternal, {
        userId: image.userId,
        amount: image.creditsUsed,
        generatedImageId: args.imageId,
        description: `Refund for failed generation`,
      })

      // Mark as failed with refund
      await ctx.runMutation(internal.images.markFailed, {
        imageId: args.imageId,
        errorMessage: userMessage,
        refunded: true,
      })
    }
  },
})
