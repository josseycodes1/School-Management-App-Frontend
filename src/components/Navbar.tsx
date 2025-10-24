"use client"

import { useState, useEffect } from "react"
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const { userData, loading: userLoading } = useUserData()
  const { unreadCount } = useAnnouncements()
  const router = useRouter()

  // Load user profile data from localStorage
  useEffect(() => {
    const loadUserProfile = () => {
      try {
        const userProfileData = localStorage.getItem("user_profile")
        if (userProfileData) {
          setUserProfile(JSON.parse(userProfileData))
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      }
    }

    loadUserProfile()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadUserProfile()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const fullName = userData
    ? `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "Admin User"
    : "Admin User"

  const role = userData ? userData.role || "admin" : "admin"

  // Safely get admission number and class level - FIXED
  const admissionNumber = (userData as any)?.admission_number || userProfile?.admission_number
  const classLevel = (userData as any)?.class_level || userProfile?.class_level

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
      setIsMobileSearchOpen(false)
    }
  }

  const handleSelect = (href: string) => {
    router.push(href)
    setSearchQuery("")
    setShowSuggestions(false)
    setIsMobileSearchOpen(false)
  }

  return (
    <div className="flex items-center justify-between p-4 relative">
      {/* Desktop Search Bar */}
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

      {/* Mobile Search Button */}
      <button 
        className="md:hidden flex items-center justify-center w-10 h-10 text-josseypink1 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
      >
        <Image src="/search.png" alt="Search" width={20} height={20} />
      </button>

      {/* Mobile Search Input */}
      {isMobileSearchOpen && (
        <div className="md:hidden absolute top-16 left-4 right-4 bg-white shadow-lg rounded-lg p-3 z-50 border border-gray-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 text-sm rounded-lg ring-2 ring-gray-300 px-3 py-2 bg-white">
              <Image src="/search.png" alt="Search" width={16} height={16} />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full p-1 bg-transparent outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                autoFocus
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Image src="/close.png" alt="Clear" width={14} height={14} />
                </button>
              )}
            </div>
          </form>
          
          {/* Mobile Dropdown suggestions */}
          {showSuggestions && matches.length > 0 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-sm max-h-48 overflow-y-auto">
              {matches.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelect(item.href)}
                >
                  <Image src={item.icon} alt={item.label} width={18} height={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ICONS AND USER */}
      <div className="flex items-center gap-4 md:gap-6 justify-end w-full">
        {/* Announcements - Always visible */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="Announcements" width={20} height={20}/>
          {unreadCount > 0 && (
            <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-pink-500 text-white rounded-full text-xs">
              {unreadCount}
            </div>
          )}
        </div>

        {/* User Info - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-col">
          {userLoading ? (
            <>
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-2 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
            </>
          ) : (
            <>
              <span className="text-xs leading-3 font-medium">{fullName}</span>
              <div className="flex items-center space-x-1 text-[10px] text-gray-500">
                <span className="capitalize">{role}</span>
                {admissionNumber && (
                  <>
                    <span>•</span>
                    <span className="font-mono">{admissionNumber}</span>
                  </>
                )}
                {classLevel && (
                  <>
                    <span>•</span>
                    <span>{classLevel}</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Avatar - Always visible */}
        <UserAvatar size={36} />

        {/* Logout - Hidden on mobile (will be in mobile menu) */}
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