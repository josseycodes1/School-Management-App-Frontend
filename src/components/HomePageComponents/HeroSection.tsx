import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6 text-center">
      {/* Background Image with Next.js optimization */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/schoolchildren3.jpg"
          alt="School children learning"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Excellence in <span className="text-[#FC46AA]">Secondary</span> Education
        </h1>
        <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-8 md:mb-10">
          Preparing students from JSS1 to SS3 for academic success and character development in a nurturing environment.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            href="/log-in" 
            className="px-6 py-3 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors font-medium shadow-md"
          >
            Log In
          </Link>
          <Link 
            href="/sign-up" 
            className="px-6 py-3 bg-white text-[#FC46AA] rounded-md hover:bg-gray-100 transition-colors font-medium shadow-md"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  )
}