import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-josseypink1 shadow-sm py-4 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="w-10 h-10 rounded-full bg-white mr-3 flex items-center justify-center text-josseypink1 font-bold">
          JC
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">JosseyCodes Academy</h1>
      </div>
      <div className="flex space-x-2 md:space-x-4">
        <Link href="/log-in" className="px-3 py-2 md:px-4 md:py-2 text-white font-medium hover:text-[#F699CD] transition-colors text-sm md:text-base">
          Log in
        </Link>
        <Link href="/sign-up" className="px-3 py-2 md:px-4 md:py-2 bg-white text-josseypink1 rounded-md hover:bg-[#F699CD] transition-colors text-sm md:text-base">
          Sign Up
        </Link>
      </div>
    </nav>
  )
}