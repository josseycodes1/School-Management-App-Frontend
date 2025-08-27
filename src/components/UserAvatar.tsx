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

  return (
    <Image 
      src={userData?.profile_image || "/avatar.png"} 
      alt="User avatar" 
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      onError={(e) => {
        //if image fails to load, fall back to default avatar
        const target = e.target as HTMLImageElement
        target.src = "/avatar.png"
      }}
    />
  )
}