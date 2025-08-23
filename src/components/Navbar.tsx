'use client'

import { useState } from "react"
import Image from "next/image"
import { useUserData } from "@/hooks/useUserData"
import { useAnnouncements } from "@/hooks/useAnnouncements"
import UserAvatar from "@/components/UserAvatar"
import LogoutButton from "@/components/LogOutButton"

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { userData, loading: userLoading } = useUserData()
  const { unreadCount, loading: announcementsLoading } = useAnnouncements()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
    // You can redirect to search results page or filter content
  }

  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <Image src="/search.png" alt="Search" width={14} height={14}/>
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-[200px] p-2 bg-transparent outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        {/* Messages Icon */}
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/message.png" alt="Messages" width={20} height={20}/>
        </div>
        
        {/* Announcements Icon with Badge */}
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
          <Image src="/announcement.png" alt="Announcements" width={20} height={20}/>
          {unreadCount > 0 && (
            <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-pink-500 text-white rounded-full text-xs'>
              {unreadCount}
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div className='flex flex-col'>
          {userLoading ? (
            <>
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-2 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
            </>
          ) : (
            <>
              <span className="text-xs leading-3 font-medium">
                {userData ? `${userData.first_name} ${userData.last_name}` : 'Guest'}
              </span>
              <span className="text-[10px] text-gray-500 text-right capitalize">
                {userData?.role || 'Unknown'}
              </span>
            </>
          )}
        </div>
        
        {/* User Avatar */}
        <UserAvatar size={36} />
        
        {/* Logout Button (optional - you can place it elsewhere if preferred) */}
        <div className="hidden md:block">
          <LogoutButton variant="text" className="text-xs">
            Logout
          </LogoutButton>
        </div>
      </div>
    </div>
  )
}

export default Navbar