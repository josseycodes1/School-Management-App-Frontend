import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-12 md:py-16 bg-gray-100 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Join Our School Community?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Schedule a visit to our campus and see firsthand how we nurture academic excellence and character development.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/admissions" className="px-6 py-3 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors font-medium">
            Apply for Admission
          </Link>
          <Link href="/contact" className="px-6 py-3 border border-white text-white rounded-md hover:bg-white/10 transition-colors font-medium">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}