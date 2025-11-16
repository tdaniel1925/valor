"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  name?: string | null
  email?: string
  imageUrl?: string | null
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}

export function UserAvatar({ name, email, imageUrl, size = "md" }: UserAvatarProps) {
  const getInitials = () => {
    if (name) {
      const parts = name.trim().split(" ")
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  return (
    <Avatar className={sizeClasses[size]}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name || email || "User"} />}
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  )
}

