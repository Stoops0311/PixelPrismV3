"use node"

import { action } from "./_generated/server"
import { api, internal } from "./_generated/api"
import { v } from "convex/values"

const platformValidator = v.union(
  v.literal("instagram"),
  v.literal("facebook"),
  v.literal("linkedin"),
  v.literal("pinterest")
)

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
const MODEL = "google/gemini-2.5-flash-lite"
const MAX_CAPTION_CHARS = 2200

const SYSTEM_PROMPT = `You are a senior social-media copywriter. Look carefully at the attached image, then write 3 distinctly different captions for the brand and a single set of hashtags.

Rules:
- Each caption must take a clearly different angle (e.g. one playful, one informative, one aspirational) — never just rephrasings of each other.
- Lean on the brand voice and target audience details provided.
- Captions are for the platforms listed; if Instagram is included keep at least one short and punchy. If LinkedIn is included one caption may be slightly more professional.
- Do NOT invent product features, prices, claims, or facts that aren't in the brief.
- Hashtags: 8-15 total, lowercase, each starts with #, no spaces inside a hashtag, no duplicates, mix of broad and niche.
- Output ONLY a JSON object matching this schema exactly:
  { "captions": [string, string, string], "hashtags": [string, ...] }
- Do not wrap the JSON in markdown code fences. Do not include any text before or after the JSON.`

function normalizeHashtag(raw: string): string | null {
  const trimmed = raw.trim().replace(/^#+/, "").replace(/\s+/g, "")
  if (!trimmed) return null
  return `#${trimmed.toLowerCase()}`
}

function tryParseJson(text: string): unknown {
  // Gemini sometimes wraps JSON in ```json ... ``` fences despite instructions.
  const stripped = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim()
  return JSON.parse(stripped)
}

export const generateCaptions = action({
  args: {
    brandId: v.id("brands"),
    imageId: v.optional(v.id("generatedImages")),
    imageUrl: v.optional(v.string()),
    selectedPlatforms: v.optional(v.array(platformValidator)),
    currentCaption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error(
        "Caption generation is not configured. Please contact support."
      )
    }

    const brand = await ctx.runQuery(api.brands.getById, {
      brandId: args.brandId,
    })
    if (!brand) {
      throw new Error("Not authenticated")
    }

    let productName: string | undefined
    let productDescription: string | undefined
    let imagePrompt: string | undefined
    let resolvedImageUrl: string | undefined = args.imageUrl

    if (args.imageId) {
      const image = await ctx.runQuery(internal.images.getInternal, {
        imageId: args.imageId,
      })
      if (!image || image.brandId !== args.brandId) {
        throw new Error("Image not found for this brand")
      }
      if (image.imageUrl) {
        resolvedImageUrl = image.imageUrl
      }
      imagePrompt = image.prompt
      if (image.productId) {
        const product = await ctx.runQuery(api.products.getById, {
          productId: image.productId,
        })
        if (product) {
          productName = product.name
          productDescription = product.description
        }
      }
    }

    if (!resolvedImageUrl) {
      throw new Error("Pick an image before generating captions.")
    }

    const platforms = args.selectedPlatforms ?? []
    const contextLines: string[] = [
      `Brand: ${brand.name}`,
      `Brand voice: ${brand.brandVoice}`,
      `Target audience: ${brand.targetAudience}`,
      `Industry: ${brand.industry}`,
      `Brand description: ${brand.description}`,
    ]
    if (brand.contentThemes) {
      contextLines.push(`Content themes: ${brand.contentThemes}`)
    }
    if (brand.keyDifferentiators) {
      contextLines.push(`Key differentiators: ${brand.keyDifferentiators}`)
    }
    if (productName) {
      contextLines.push(`Product: ${productName}`)
      if (productDescription) {
        contextLines.push(`Product description: ${productDescription}`)
      }
    }
    if (imagePrompt) {
      contextLines.push(`Image generation prompt (for extra context): ${imagePrompt}`)
    }
    if (platforms.length > 0) {
      contextLines.push(`Target platforms: ${platforms.join(", ")}`)
    }
    if (args.currentCaption && args.currentCaption.trim().length > 0) {
      contextLines.push(
        `User's current draft caption (treat as a hint, do not copy verbatim):\n${args.currentCaption.trim()}`
      )
    }
    contextLines.push(
      "",
      "Return JSON in this exact shape:",
      `{ "captions": [string, string, string], "hashtags": [string, ...] }`
    )

    const userText = contextLines.join("\n")

    const body = {
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: userText },
            { type: "image_url", image_url: { url: resolvedImageUrl } },
          ],
        },
      ],
      temperature: 0.85,
      max_tokens: 800,
      response_format: { type: "json_object" },
    }

    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pixelprism.app",
        "X-OpenRouter-Title": "PixelPrism",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `Caption API error (${response.status}): ${errorBody.slice(0, 400)}`
      )
    }

    const result = await response.json()
    const content: unknown = result?.choices?.[0]?.message?.content
    if (typeof content !== "string" || content.trim().length === 0) {
      throw new Error("Caption generator returned an empty response. Try again.")
    }

    let parsed: unknown
    try {
      parsed = tryParseJson(content)
    } catch {
      throw new Error(
        "Caption generator returned an invalid response. Try again."
      )
    }

    if (typeof parsed !== "object" || parsed === null) {
      throw new Error(
        "Caption generator returned an invalid response. Try again."
      )
    }
    const parsedObj = parsed as { captions?: unknown; hashtags?: unknown }
    const rawCaptions = parsedObj.captions
    const rawHashtags = parsedObj.hashtags
    if (
      !Array.isArray(rawCaptions) ||
      rawCaptions.length < 1 ||
      !rawCaptions.every((c) => typeof c === "string")
    ) {
      throw new Error(
        "Caption generator returned an invalid response. Try again."
      )
    }

    const captions = rawCaptions
      .slice(0, 3)
      .map((c: string) => c.trim().slice(0, MAX_CAPTION_CHARS))
      .filter((c) => c.length > 0)

    if (captions.length === 0) {
      throw new Error(
        "Caption generator returned an invalid response. Try again."
      )
    }

    while (captions.length < 3) {
      captions.push(captions[captions.length - 1])
    }

    const hashtagsInput = Array.isArray(rawHashtags) ? rawHashtags : []
    const hashtags = Array.from(
      new Set(
        hashtagsInput
          .filter((h: unknown): h is string => typeof h === "string")
          .map(normalizeHashtag)
          .filter((h): h is string => h !== null)
      )
    )

    return { captions, hashtags }
  },
})
