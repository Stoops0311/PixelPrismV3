import { createUploadthing, type FileRouter } from "uploadthing/server"

const f = createUploadthing()

export const ourFileRouter = {
  // Product reference images (client-side upload)
  productImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 10 },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl }
  }),

  // Brand logos (client-side upload, multi-logo support)
  brandLogo: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl }
  }),

  // Template reference images (1-3 example images for template extraction)
  templateReference: f({
    image: { maxFileSize: "8MB", maxFileCount: 3 },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl }
  }),

  // Per-generation image-field uploads (photos a user drops into a template's image slot)
  templateFieldImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl }
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
