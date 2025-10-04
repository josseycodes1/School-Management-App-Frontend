"use client";

import Image from "next/image";
import Link from "next/link";
import { useUserData } from "@/hooks/useUserData";
import { useState, useEffect } from "react";

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
        icon: "/dashboard.png",
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

const Menu = () => {
  const { userData, loading } = useUserData();
  const role = userData?.role || "admin";
  const [activeItem, setActiveItem] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Filter visible items for mobile bottom nav
  const mobileBottomNavItems = menuItems
    .flatMap(section => section.items)
    .filter(item => item.visible.includes(role))
    .filter(item => ["Home", "Dashboard", "Profile", "Settings"].includes(item.label))
    .slice(0, 4);

  // If it's mobile, only render the bottom navigation
  if (isMobile) {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-50 shadow-lg safe-area-bottom">
        {mobileBottomNavItems.map((item, index) => {
          const href = item.dynamicDashboard
            ? dashboardRoutes[role] || "/"
            : item.href;

          const isActive = activeItem === item.label;

          return (
            <Link
              key={index}
              href={href}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors flex-1 max-w-20 ${
                isActive ? 'text-josseypink1' : 'text-gray-500'
              }`}
              onClick={() => setActiveItem(item.label)}
            >
              <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${
                isActive ? 'bg-josseypink1 bg-opacity-10' : ''
              }`}>
                <Image 
                  src={item.icon} 
                  alt={item.label} 
                  width={16} 
                  height={16} 
                  className={isActive ? 'filter brightness-0 invert' : ''}
                />
              </div>
              <span className="text-xs mt-1 font-medium text-center leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    );
  }

  // Desktop sidebar menu
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {menuItems.map((section) => (
          <div className="flex flex-col gap-1 mb-6" key={section.title}>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 py-2 px-4 rounded-lg border border-gray-100">
              {section.title}
            </span>

            {section.items.map((item) => {
              if (item.visible.includes(role)) {
                const href = item.dynamicDashboard
                  ? dashboardRoutes[role] || "/"
                  : item.href;

                const isActive = activeItem === item.label;

                return (
                  <Link
                    href={href}
                    key={item.label}
                    className={`flex items-center gap-3 text-gray-700 py-3 px-3 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-josseypink1 text-white shadow-md' 
                        : 'hover:bg-josseypink1 hover:bg-opacity-10 hover:text-josseypink1'
                      }`}
                    onClick={() => setActiveItem(item.label)}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-white bg-opacity-20' 
                        : 'bg-gray-100 group-hover:bg-josseypink1 group-hover:bg-opacity-20'
                      }`}>
                      <Image 
                        src={item.icon} 
                        alt={item.label} 
                        width={18} 
                        height={18} 
                        className={`transition-colors ${
                          isActive ? 'filter brightness-0 invert' : 'group-hover:filter group-hover:brightness-0 group-hover:invert'
                        }`}
                      />
                    </div>
                    <span className="font-medium transition-colors">
                      {item.label}
                    </span>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;


// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useUserData } from "@/hooks/useUserData";

// const dashboardRoutes: Record<string, string> = {
//   admin: "/admin",
//   teacher: "/teacher",
//   student: "/student",
//   parent: "/parent",
// };

// const menuItems = [
//   {
//     title: "MENU",
//     items: [
//       {
//         icon: "/home.png",
//         label: "Home",
//         href: "/",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/lesson.png",
//         label: "Dashboard",
//         href: "/", 
//         visible: ["admin", "teacher", "student", "parent"],
//         dynamicDashboard: true, 
//       },
//       {
//         icon: "/teacher.png",
//         label: "Teachers",
//         href: "/list/teachers",
//         visible: ["admin", "teacher"],
//       },
//       {
//         icon: "/student.png",
//         label: "Students",
//         href: "/list/students",
//         visible: ["admin", "teacher"],
//       },
//       {
//         icon: "/parent.png",
//         label: "Parents",
//         href: "/list/parents",
//         visible: ["admin", "teacher"],
//       },
//       {
//         icon: "/subject.png",
//         label: "Subjects",
//         href: "/list/subjects",
//         visible: ["admin"],
//       },
//       {
//         icon: "/class.png",
//         label: "Classes",
//         href: "/list/classes",
//         visible: ["admin", "teacher"],
//       },
//       {
//         icon: "/exam.png",
//         label: "Exams",
//         href: "/list/exams",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/result.png",
//         label: "Results",
//         href: "/list/results",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/calendar.png",
//         label: "Events",
//         href: "/list/events",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/announcement.png",
//         label: "Announcements",
//         href: "/list/announcements",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//     ],
//   },
//   {
//     title: "OTHER",
//     items: [
//       {
//         icon: "/profile.png",
//         label: "Profile",
//         href: "/profile",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/setting.png",
//         label: "Settings",
//         href: "/settings",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/logout.png",
//         label: "Logout",
//         href: "/logout",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//     ],
//   },
// ];

// const Menu = () => {
//   const { userData, loading } = useUserData();
//   const role = userData?.role || "admin"; 

//   return (
//     <div className="mt-4 text-sm">
//       {menuItems.map((section) => (
//         <div className="flex flex-col gap-2" key={section.title}>
//           <span className="hidden lg:block text-black font-light my-4">
//             {section.title}
//           </span>
//           {section.items.map((item) => {
//             if (item.visible.includes(role)) {
//               const href = item.dynamicDashboard
//                 ? dashboardRoutes[role] || "/"
//                 : item.href;

//               return (
//                 <Link
//                   href={href}
//                   key={item.label}
//                   className="flex items-center justify-center lg:justify-start gap-4 text-gray-700 py-2 md:px-2 rounded-md hover:bg-josseypink1"
//                 >
//                   <Image src={item.icon} alt="" width={20} height={20} />
//                   <span className="hidden lg:block">{item.label}</span>
//                 </Link>
//               );
//             }
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Menu;
