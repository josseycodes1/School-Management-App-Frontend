import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 text-center bg-gradient-to-r from-pink-50 to-purple-50">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
        Excellence in <span className="text-[#FC46AA]">Secondary</span> Education
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 md:mb-10">
        Preparing students from JSS1 to SS3 for academic success and character development in a nurturing environment.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="/home" className="px-6 py-3 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors font-medium">
          Begin Admission Process
        </Link>
        <Link href="/home" className="px-6 py-3 border border-[#FC46AA] text-[#FC46AA] rounded-md hover:bg-[#FC46AA]/10 transition-colors font-medium">
          Schedule a School Tour
        </Link>
      </div>
    </section>
  )
}