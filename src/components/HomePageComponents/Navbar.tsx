import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm py-4 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="w-10 h-10 rounded-full bg-[#FC46AA] mr-3 flex items-center justify-center text-white font-bold">
          JC
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">JosseyCodes Academy</h1>
      </div>
      <div className="flex space-x-2 md:space-x-4">
        <Link href="/portal-login" className="px-3 py-2 md:px-4 md:py-2 text-[#FC46AA] font-medium hover:text-[#F699CD] transition-colors text-sm md:text-base">
          Login
        </Link>
        <Link href="/admissions" className="px-3 py-2 md:px-4 md:py-2 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors text-sm md:text-base">
          Sign Up
        </Link>
      </div>
    </nav>
  )
}