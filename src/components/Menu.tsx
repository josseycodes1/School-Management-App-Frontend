"use client";

import Image from "next/image";
import Link from "next/link";
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
      // {
      //   icon: "/lesson.png",
      //   label: "Home",
      //   href: "/",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      {
        icon: "/home.png",
        label: "Overview",
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

const Menu = () => {
  const { userData, loading } = useUserData();
  const role = userData?.role || "admin"; 

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-black font-light my-4">
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
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-700 py-2 md:px-2 rounded-md hover:bg-josseypink1"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
