"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useUserData } from "@/hooks/useUserData";

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
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userData, loading } = useUserData();
  const role = userData?.role || "admin";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <Link
            href="/"
            className="flex items-center"
            onClick={toggleMenu}
          >
            <div className="w-12 h-12 text-white rounded-full mr-3 flex items-center justify-center bg-josseypink1 border-2 border-black">
              JC
            </div>
            <span className="font-bold text-josseypink1">JOSSEYCODES ACADEMY</span>
          </Link>
        </div>

        {/* Menu Items */}
        <div className="p-4 overflow-y-auto h-full">
          {menuItems.map((section) => (
            <div className="flex flex-col gap-2 mb-6" key={section.title}>
              <span className="text-black font-light my-2 text-sm uppercase tracking-wide">
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
                      className="flex items-center gap-4 text-gray-700 py-3 px-2 rounded-md hover:bg-josseypink1 hover:text-white transition-colors duration-200"
                      onClick={toggleMenu}
                    >
                      <Image src={item.icon} alt="" width={20} height={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                }
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;