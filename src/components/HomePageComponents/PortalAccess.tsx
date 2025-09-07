import Link from 'next/link'

export default function PortalAccess() {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center py-20 px-4 text-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/website4.jpg')" }}
      >
        {/* Increased overlay darkness for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-md">Parent & Student Portal</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-white drop-shadow-md">
          Existing parents, students, and staff can access our portal for grades, assignments, and school communications.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/log-in" className="px-8 py-3 bg-white text-[#FC46AA] rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg">
            Log In
          </Link>
          <Link href="/sign-up" className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#FC46AA] transition-all duration-300 font-medium shadow-lg">
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  )
}