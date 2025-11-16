"use client"

import Image from "next/image"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  quality?: number
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  priority = false,
  quality = 75,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <Skeleton
          className="absolute inset-0"
          style={fill ? undefined : { width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  )
}

