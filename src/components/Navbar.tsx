"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useUserData } from "@/hooks/useUserData"
import { useAnnouncements } from "@/hooks/useAnnouncements"
import UserAvatar from "@/components/UserAvatar"
import LogoutButton from "@/components/LogOutButton"
import { menuItems } from "@/lib/menuData"
import { role as staticRole } from "@/lib/data"

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { userData, loading: userLoading } = useUserData()
  const { unreadCount } = useAnnouncements()
  const router = useRouter()

  // handle full name with fallback
  const fullName = userData
    ? `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "Admin User"
    : "Admin User"

  // handle role with fallback
  const role = userData ? userData.role || "admin" : "admin"

  // Flatten menu items for searching
  const searchableItems = menuItems.flatMap(section => section.items)
    .filter(item => item.visible.includes(role || staticRole))

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault()
  if (!searchQuery.trim()) return

  const query = searchQuery.toLowerCase().trim()

  // allow multiple matches
  const matches = searchableItems.filter(item =>
    item.label.toLowerCase().includes(query)
  )

  console.log("Search matches:", matches) // 👈 for debugging

  if (matches.length > 0) {
    router.push(matches[0].href) // navigate to first match
  } else {
    alert("No matching page found")
  }
}


  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
      >
        <Image src="/search.png" alt="Search" width={14} height={14}/>
        <input
          type="text"
          placeholder="Search anything..."
          className="w-[200px] p-2 bg-transparent outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* hidden button so Enter key works reliably */}
        <button type="submit" className="hidden">Search</button>
      </form>


      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* Announcements */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="Announcements" width={20} height={20}/>
          {unreadCount > 0 && (
            <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-pink-500 text-white rounded-full text-xs">
              {unreadCount}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          {userLoading ? (
            <>
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-2 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
            </>
          ) : (
            <>
              <span className="text-xs leading-3 font-medium">
                {fullName}
              </span>
              <span className="text-[10px] text-gray-500 text-right capitalize">
                {role}
              </span>
            </>
          )}
        </div>

        {/* Avatar */}
        <UserAvatar size={36} />

        {/* Logout */}
        <div className="hidden md:block">
          <LogoutButton
            variant="text"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-pink-400 to-red-400 text-white hover:from-pink-500 hover:to-red-500 rounded-full shadow-md transition"
          >
            <Image src="/logout.png" alt="Logout" width={14} height={14} />
            <span>Logout</span>
          </LogoutButton>
        </div>
      </div>
    </div>
  )
}

export default Navbar
