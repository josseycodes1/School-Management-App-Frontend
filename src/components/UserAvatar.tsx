'use client'

import Image from "next/image"
import { useUserData } from "@/hooks/useUserData"

interface UserAvatarProps {
  size?: number
  className?: string
}

export default function UserAvatar({ size = 36, className = "" }: UserAvatarProps) {
  const { userData, loading } = useUserData()

  if (loading) {
    return (
      <div 
        className={`rounded-full bg-gray-200 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  
  const imageUrl = userData?.profile_image || "/blueavatar.png"

  return (
    <Image 
      src={imageUrl} 
      alt="User avatar" 
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      unoptimized
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.src = "/blueavatar.png"
      }}
    />
  )
}
