import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-10 md:py-20 bg-white -mt-8">
      <div className="max-w-6xl mx-auto px-2 md:px-8 lg:px-8"> 
        <div className="rounded-2xl shadow-xl p-10 md:p-12 text-center">
          <h2 className="text-3xl text-gray-700 md:text-4xl font-bold mb-8">Ready to Join Our School Community?</h2>
          <p className="text-xl mb-10 max-w-3xl text-gray-700 mx-auto leading-relaxed"> 
            Schedule a visit to our campus and see firsthand how we nurture academic excellence and character development.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/admission" className="p-4 bg-josseypink1 text-white rounded-xl hover:bg-josseypink9 font-medium text-lg shadow-md hover:shadow-lg">
              Apply for Admission
            </Link>
            <Link href="/admission" className="p-4 bg-josseypink1 text-white rounded-xl hover:bg-josseypink9 font-medium text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}