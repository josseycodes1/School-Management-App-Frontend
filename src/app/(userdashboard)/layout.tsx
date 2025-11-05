import Menu from "@/components/Menu";
import MobileMenu from "@/components/MobileMenu";
import Navbar from "@/components/Navbar";
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
          <span className="hidden lg:block font-bold text-josseypink1"></span>
        </Link>
        <Menu />
      </div>
      
      {/* RIGHT */}
      <div className="w-full md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-30">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 text-white rounded-full mr-3 flex items-center justify-center bg-josseypink1 border-2 border-black">
              JC
            </div>
            <span className="font-bold text-josseypink1">JOSSEYCODES ACADEMY</span>
          </Link>
          <MobileMenu />
        </div>
        
        {/* Navbar - Now visible on both mobile and desktop */}
        <div className="bg-white border-b border-gray-200 sticky top-0 md:top-0 z-20">
          <Navbar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}