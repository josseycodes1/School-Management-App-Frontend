"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useUserData } from "@/hooks/useUserData"
import { useAnnouncements } from "@/hooks/useAnnouncements"
import UserAvatar from "@/components/UserAvatar"
import LogoutButton from "@/components/LogOutButton"
import { menuItems } from "@/lib/menuData"

const dashboardRoutes: Record<string, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
}

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { userData, loading: userLoading } = useUserData()
  const { unreadCount } = useAnnouncements()
  const router = useRouter()


  const fullName = userData
    ? `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "Admin User"
    : "Admin User"

  const role = userData ? userData.role || "admin" : "admin"


  const searchableItems = menuItems
    .flatMap(section => section.items)
    .filter(item => item.visible.includes(role))
    .map(item => ({
      ...item,
      href: item.label === "Dashboard" ? dashboardRoutes[role] || "/" : item.href,
    }))


  const matches = searchQuery.trim()
    ? searchableItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (matches.length > 0) {
      router.push(matches[0].href) 
      setSearchQuery("")
      setShowSuggestions(false)
    }
  }

  const handleSelect = (href: string) => {
    router.push(href)
    setSearchQuery("")
    setShowSuggestions(false)
  }

  return (
    <div className="flex items-center justify-between p-4 relative">
      {/* SEARCH BAR */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 relative"
      >
        <Image src="/search.png" alt="" width={14} height={14}/>
        <input
          type="text"
          placeholder="Search anything..."
          className="w-[200px] p-2 bg-transparent outline-none"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowSuggestions(true)
          }}
        />
        <button type="submit" className="hidden">Search</button>

        {/* Dropdown suggestions */}
        {showSuggestions && matches.length > 0 && (
          <div className="absolute top-10 left-0 w-full bg-white shadow-md rounded-md text-gray-700 z-50">
            {matches.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(item.href)}
              >
                <Image src={item.icon} alt={item.label} width={16} height={16} />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        )}
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
              <span className="text-xs leading-3 font-medium">{fullName}</span>
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
