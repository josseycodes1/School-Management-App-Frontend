import Menu from "@/components/Menu";
import MobileMenu from "@/components/MobileMenu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT - Desktop Sidebar */}
      <div className="hidden md:block w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start"
        >
          <div className="w-12 h-12 text-white rounded-full mr-3 flex items-center justify-center bg-josseypink1 border-2 border-black">
              JC
            </div>
          <span className="hidden lg:block font-bold text-josseypink1">JOSSEYCODES ACADEMY</span>
        </Link>
        <Menu />
      </div>
      
      {/* RIGHT */}
      <div className="w-full md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll flex flex-col">
        {/* Mobile Menu Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 text-white rounded-full mr-3 flex items-center justify-center bg-josseypink1 border-2 border-black">
              JC
            </div>
            <span className="font-bold text-josseypink1">JOSSEYCODES ACADEMY</span>
          </Link>
          <MobileMenu />
        </div>
        
        {/* Desktop Navbar - Hidden on mobile */}
        <div className="hidden md:block">
          <Navbar />
        </div>
        
        {children}
      </div>
    </div>
  );
}

// import Menu from "@/components/Menu";
// import Navbar from "@/components/Navbar";
// import Image from "next/image";
// import Link from "next/link";

// export default function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div className="h-screen flex">
//       {/* LEFT */}
//       <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
//         <Link
//           href="/"
//           className="flex items-center justify-center lg:justify-start"
//         >
//           <div  className="w-12 h-12 md:w-12 md:h-12 text-white rounded-full 
//           mr-3 flex items-center justify-center bg-josseypink1 border-2 border-black
//         ">
//             JC
//           </div>
//           <span className="hidden lg:block font-bold text-josseypink1">JOSSEYCODES ACADEMY</span>
//         </Link>
//         <Menu />
//       </div>
//       {/* RIGHT */}
//       <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll flex flex-col">
//         <Navbar />
//         {children}
//       </div>
//     </div>
//   );
// }