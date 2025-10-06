import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12"> {/* Increased to max-w-6xl and added lg:px-12 */}
        <div className="bg-josseypink1 rounded-2xl shadow-xl p-10 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Join Our School Community?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed"> {/* Increased text container width too */}
            Schedule a visit to our campus and see firsthand how we nurture academic excellence and character development.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/admission" className="px-10 py-4 bg-josseypink1 text-white rounded-xl hover:bg-josseypink2 transition-all duration-300 font-medium text-lg shadow-md hover:shadow-lg">
              Apply for Admission
            </Link>
            <Link href="/contact" className="px-10 py-4 border-2 bg-josseypink1 text-white rounded-xl hover:bg-josseypink2 transition-all duration-300 font-medium text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}