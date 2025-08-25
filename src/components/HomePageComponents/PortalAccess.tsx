// components/PortalAccess.tsx
import Link from 'next/link'

export default function PortalAccess() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-[#FC46AA] to-[#F699CD] text-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Parent & Student Portal</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Existing parents, students, and staff can access our portal for grades, assignments, and school communications.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/portal-login" className="px-6 py-3 bg-white text-[#FC46AA] rounded-md hover:bg-gray-100 transition-colors font-medium">
            Portal Login
          </Link>
          <Link href="/portal-help" className="px-6 py-3 border border-white text-white rounded-md hover:bg-white/10 transition-colors font-medium">
            Portal Help
          </Link>
        </div>
      </div>
    </section>
  )
}