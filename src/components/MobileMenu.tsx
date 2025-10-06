"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import UserAvatar from "@/components/UserAvatar";
import LogoutButton from "@/components/LogOutButton";

const dashboardRoutes: Record<string, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
};

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/lesson.png",
        label: "Dashboard",
        href: "/", 
        visible: ["admin", "teacher", "student", "parent"],
        dynamicDashboard: true, 
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { userData, loading } = useUserData();
  const { unreadCount } = useAnnouncements();
  const router = useRouter();

  const role = userData?.role || "admin";
  const fullName = userData
    ? `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "User"
    : "User";

  const searchableItems = menuItems
    .flatMap(section => section.items)
    .filter(item => item.visible.includes(role))
    .map(item => ({
      ...item,
      href: item.label === "Dashboard" ? dashboardRoutes[role] || "/" : item.href,
    }));

  const matches = searchQuery.trim()
    ? searchableItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSelect = (href: string) => {
    router.push(href);
    setSearchQuery("");
    setShowSuggestions(false);
    setIsMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matches.length > 0) {
      handleSelect(matches[0].href);
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className="md:hidden flex flex-col space-y-1.5 w-8 h-8 justify-center items-center text-josseypink1"
        onClick={toggleMenu}
      >
        <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header with User Info */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-josseypink1 to-pink-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center"
              onClick={toggleMenu}
            >
              <div className="w-12 h-12 text-josseypink1 rounded-full mr-3 flex items-center justify-center bg-white border-2 border-white">
                JC
              </div>
              <span className="font-bold text-white">JOSSEYCODES ACADEMY</span>
            </Link>
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <UserAvatar size={48} />
            <div className="flex-1">
              <div className="font-semibold text-white">{fullName}</div>
              <div className="text-xs text-white/80 capitalize">{role}</div>
            </div>
            <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer relative">
              <Image src="/announcement.png" alt="Announcements" width={16} height={16} className="text-josseypink1"/>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white rounded-full text-xs">
                  {unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search in Mobile Menu */}
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center gap-2 text-sm rounded-lg ring-1 ring-gray-300 px-3 py-2 bg-gray-50">
              <Image src="/search.png" alt="Search" width={16} height={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search menu..."
                className="w-full p-1 bg-transparent outline-none text-gray-700"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
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
            
            {/* Search Suggestions */}
            {showSuggestions && matches.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {matches.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-josseypink1 hover:text-white border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelect(item.href)}
                  >
                    <Image src={item.icon} alt={item.label} width={16} height={16} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Menu Items */}
        <div className="p-4 overflow-y-auto h-[calc(100%-200px)]">
          {menuItems.map((section) => (
            <div className="flex flex-col gap-1 mb-6" key={section.title}>
              <span className="text-gray-500 font-medium my-2 text-xs uppercase tracking-wider">
                {section.title}
              </span>
              {section.items.map((item) => {
                if (item.visible.includes(role)) {
                  const href = item.dynamicDashboard
                    ? dashboardRoutes[role] || "/"
                    : item.href;

                  return (
                    <Link
                      href={href}
                      key={item.label}
                      className="flex items-center gap-3 text-gray-700 py-2 px-3 rounded-lg hover:bg-josseypink1 hover:text-white transition-all duration-200"
                      onClick={toggleMenu}
                    >
                      <Image src={item.icon} alt="" width={18} height={18} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                }
              })}
            </div>
          ))}
          
          {/* Logout Button in Mobile Menu */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <LogoutButton
              variant="text"
              className="flex items-center gap-3 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              onClick={toggleMenu}
            >
              <Image src="/logout.png" alt="Logout" width={18} height={18} />
              <span className="font-medium">Logout</span>
            </LogoutButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;