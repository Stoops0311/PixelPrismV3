import { createUploadthing, type FileRouter } from "uploadthing/server"

const f = createUploadthing()

export const ourFileRouter = {
  // Product reference images (client-side upload)
  productImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 10 },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl }
  }),

  // Brand logos (client-side upload)
  brandLogo: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl }
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
