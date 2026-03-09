// ── Color Grid Utilities ────────────────────────────────────────────────────
// Extracts a 4×4 mosaic of representative colors from a product image.
// Used as the visual identity ("PixelPrism") for products everywhere.

// Convert HSL values to a CSS hex string
function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * Deterministic hash-based color grid. Pure function, no async.
 * Uses djb2-style hash to generate 16 varied dark-toned hex colors.
 */
export function hashColorGrid(id: string): string[] {
  const colors: string[] = []
  let seed = 0
  for (let i = 0; i < id.length; i++) {
    seed = ((seed << 5) - seed + id.charCodeAt(i)) | 0
  }

  for (let i = 0; i < 16; i++) {
    // Advance the seed each iteration for variety
    seed = ((seed << 5) - seed + i * 2654435769) | 0
    const h = Math.abs(seed % 360)
    const s = 30 + Math.abs((seed >> 4) % 40)  // 30–70%
    const l = 15 + Math.abs((seed >> 8) % 20)  // 15–35%
    colors.push(hslToHex(h, s, l))
  }

  return colors
}

/**
 * Extracts a 4×4 color grid by sampling the center of each cell from an image.
 * Browser-only (uses HTMLCanvasElement). Falls back to hashColorGrid on error.
 */
export async function extractColorGrid(imageUrl: string, id = imageUrl): Promise<string[]> {
  if (typeof window === "undefined") {
    return hashColorGrid(id)
  }

  return new Promise<string[]>((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        canvas.width = 200
        canvas.height = 200
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(hashColorGrid(id))
          return
        }

        ctx.drawImage(img, 0, 0, 200, 200)

        const cellW = 200 / 4
        const cellH = 200 / 4
        const colors: string[] = []

        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            // Sample from the CENTER of each cell
            const x = Math.floor(col * cellW + cellW / 2)
            const y = Math.floor(row * cellH + cellH / 2)
            const pixel = ctx.getImageData(x, y, 1, 1).data
            const hex =
              "#" +
              pixel[0].toString(16).padStart(2, "0") +
              pixel[1].toString(16).padStart(2, "0") +
              pixel[2].toString(16).padStart(2, "0")
            colors.push(hex)
          }
        }

        resolve(colors)
      } catch {
        resolve(hashColorGrid(id))
      }
    }

    img.onerror = () => resolve(hashColorGrid(id))
    img.src = imageUrl
  })
}
