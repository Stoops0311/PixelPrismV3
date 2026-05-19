"use node"

import { action } from "./_generated/server"
import { api } from "./_generated/api"
import { v } from "convex/values"

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
const MODEL = "google/gemini-2.5-flash-lite"

const ALLOWED_FIELD_TYPES = new Set(["text", "longtext", "list", "image"])
const ALLOWED_ASPECT_RATIOS = new Set([
  "1:1",
  "4:5",
  "16:9",
  "9:16",
  "3:4",
  "4:3",
  "3:2",
  "2:3",
  "21:9",
])

const SYSTEM_PROMPT = `You are a senior visual design analyst. You will receive 1-3 example marketing images that share a reusable template. Your job is to produce a JSON definition that lets someone regenerate images in the same template later by filling in editable fields.

You MUST output ONLY a JSON object matching this exact schema:
{
  "name": string,
  "description": string,
  "styleDescription": string,
  "detectedAspectRatio": string,
  "fields": [
    { "id": string, "name": string, "type": "text" | "longtext" | "list" | "image", "placeholder": string }
  ]
}

Rules:
- "name": short, descriptive label (2-5 words) — e.g. "Course Promo Square", "Quote Card", "Product Reveal".
- "description": one short sentence describing what this template is used for.
- "styleDescription": A vivid, detailed PARAGRAPH (4-8 sentences) capturing everything a regeneration would need: overall composition and layout zones (top, left, right, bottom, etc.), exact color palette with hex values you can read from the image, typography (font weight, case, alignment), photographic or illustrative treatment, mood, lighting, accent shapes or graphic elements, and any consistent decorative motifs. Be specific. This text is fed directly into an image-generation model as the style brief.
- "detectedAspectRatio": Pick the closest from this exact list: "1:1", "4:5", "16:9", "9:16", "3:4", "4:3", "3:2", "2:3", "21:9".
- "fields": List every editable slot a user would want to change between generations. Detect them from differences across the examples and from visually replaceable content. Use these types:
  - "text": short single-line string (headline, pill chip, phone, website)
  - "longtext": multi-line string (paragraph, sub-headline)
  - "list": a list of short bullets (3-6 items typical)
  - "image": a user-supplied photograph (e.g. person, product). Use this for any photograph slot that obviously changes.
- Each field "id" must be a short snake_case slug ("headline", "pill_chip", "bullets", "person_photo", "phone", "website"). Lowercase, no spaces, no leading numbers.
- Each field "name" is the human display label ("Headline", "Pill Chip", "Bullets", "Person Photo", "Phone", "Website").
- "placeholder" should be the value taken from the FIRST example image (so the user sees what kind of thing goes there).
- Do NOT include a "logos" field — brand logos are handled separately via a global toggle.
- Do NOT include slots for static decorative elements that don't change between generations.
- Order fields top-to-bottom, left-to-right as they appear.

Do not wrap the JSON in markdown code fences. Do not include any text before or after the JSON.`

function tryParseJson(text: string): unknown {
  const stripped = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim()
  return JSON.parse(stripped)
}

function slugify(raw: string, fallback: string): string {
  const s = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_\s-]/g, "")
    .replace(/[\s-]+/g, "_")
    .replace(/^[0-9_]+/, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
  return s || fallback
}

interface ExtractedField {
  id: string
  name: string
  type: "text" | "longtext" | "list" | "image"
  placeholder?: string
}

interface ExtractedTemplate {
  name: string
  description: string
  styleDescription: string
  detectedAspectRatio: string
  fields: ExtractedField[]
}

export const extractTemplate = action({
  args: {
    brandId: v.id("brands"),
    imageUrls: v.array(v.string()),
  },
  handler: async (ctx, args): Promise<ExtractedTemplate> => {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error(
        "Template extraction is not configured. Please contact support."
      )
    }

    if (args.imageUrls.length === 0) {
      throw new Error("Upload at least one example image.")
    }
    if (args.imageUrls.length > 3) {
      throw new Error("Up to 3 example images.")
    }

    const brand = await ctx.runQuery(api.brands.getById, {
      brandId: args.brandId,
    })
    if (!brand) {
      throw new Error("Not authenticated")
    }

    const userTextLines = [
      `Brand: ${brand.name}`,
      `Industry: ${brand.industry}`,
      `Brand voice: ${brand.brandVoice}`,
      "",
      `Analyze the ${args.imageUrls.length === 1 ? "image" : `${args.imageUrls.length} images`} attached and produce the JSON template definition.`,
    ]

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    > = [{ type: "text", text: userTextLines.join("\n") }]
    for (const url of args.imageUrls) {
      content.push({ type: "image_url", image_url: { url } })
    }

    const body = {
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
      temperature: 0.4,
      max_tokens: 1500,
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
        `Template extractor error (${response.status}): ${errorBody.slice(0, 400)}`
      )
    }

    const result = await response.json()
    const text: unknown = result?.choices?.[0]?.message?.content
    if (typeof text !== "string" || text.trim().length === 0) {
      throw new Error(
        "Template extractor returned an empty response. Try again."
      )
    }

    let parsed: unknown
    try {
      parsed = tryParseJson(text)
    } catch {
      throw new Error(
        "Template extractor returned an invalid response. Try again."
      )
    }

    if (typeof parsed !== "object" || parsed === null) {
      throw new Error(
        "Template extractor returned an invalid response. Try again."
      )
    }

    const obj = parsed as Record<string, unknown>

    const name =
      typeof obj.name === "string" && obj.name.trim().length > 0
        ? obj.name.trim().slice(0, 80)
        : "Untitled Template"

    const description =
      typeof obj.description === "string"
        ? obj.description.trim().slice(0, 280)
        : ""

    const styleDescription =
      typeof obj.styleDescription === "string"
        ? obj.styleDescription.trim()
        : ""
    if (!styleDescription) {
      throw new Error(
        "Template extractor did not return a usable style description. Try again."
      )
    }

    const aspectRaw =
      typeof obj.detectedAspectRatio === "string"
        ? obj.detectedAspectRatio.trim()
        : ""
    const detectedAspectRatio = ALLOWED_ASPECT_RATIOS.has(aspectRaw)
      ? aspectRaw
      : "1:1"

    const rawFields = Array.isArray(obj.fields) ? obj.fields : []
    const seenIds = new Set<string>()
    const fields: ExtractedField[] = []
    let counter = 1
    for (const raw of rawFields) {
      if (typeof raw !== "object" || raw === null) continue
      const r = raw as Record<string, unknown>
      const fieldName =
        typeof r.name === "string" && r.name.trim().length > 0
          ? r.name.trim().slice(0, 60)
          : `Field ${counter}`
      const fieldType =
        typeof r.type === "string" && ALLOWED_FIELD_TYPES.has(r.type)
          ? (r.type as ExtractedField["type"])
          : "text"
      const fallbackSlug = `field_${counter}`
      const rawId =
        typeof r.id === "string" && r.id.trim().length > 0
          ? r.id
          : fieldName
      let id = slugify(rawId, fallbackSlug)
      // Skip any field that the model accidentally tagged as logos — handled globally.
      if (id === "logo" || id === "logos" || id === "brand_logos") {
        counter++
        continue
      }
      // Deduplicate ids
      let unique = id
      let suffix = 2
      while (seenIds.has(unique)) {
        unique = `${id}_${suffix}`
        suffix++
      }
      id = unique
      seenIds.add(id)

      const placeholder =
        typeof r.placeholder === "string"
          ? r.placeholder.trim().slice(0, 280)
          : undefined

      fields.push({ id, name: fieldName, type: fieldType, placeholder })
      counter++
    }

    return {
      name,
      description,
      styleDescription,
      detectedAspectRatio,
      fields,
    }
  },
})
