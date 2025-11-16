// Image utility functions

/**
 * Gets optimized image URL for Next.js Image component
 */
export function getOptimizedImageUrl(
  src: string,
  width?: number,
  quality?: number
): string {
  if (!src) return "/placeholder-image.png"

  // If it's already a full URL, return as is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src
  }

  // For Next.js Image optimization
  if (width) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
  }

  return src
}

/**
 * Gets image dimensions from file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.width,
        height: img.height,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }

    img.src = url
  })
}

/**
 * Compresses image
 */
export function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Failed to get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"))
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

/**
 * Validates image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size exceeds 10MB. Please compress the image.",
    }
  }

  return { valid: true }
}

