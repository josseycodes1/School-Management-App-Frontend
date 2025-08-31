'use client'

import Image from "next/image"
import { useState } from "react"
import { useUserData } from "@/hooks/useUserData"

interface UserAvatarProps {
  size?: number
  className?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://school-management-app.onrender.com"

export default function UserAvatar({ size = 36, className = "" }: UserAvatarProps) {
  const { userData, loading } = useUserData()
  const [error, setError] = useState(false)

  if (loading) {
    return (
      <div 
        className={`rounded-full bg-gray-200 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  // If error loading image or no profile_image, show default avatar
  const imageUrl = !error && userData?.profile_image
    ? `${BASE_URL}${userData.profile_image}`
    : "/avatar.png"

  return (
    <Image 
      src={imageUrl} 
      alt="User avatar" 
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      onError={() => setError(true)}
    />
  )
}
