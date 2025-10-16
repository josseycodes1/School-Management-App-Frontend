import Link from 'next/link'

export default function AboutUs() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
          About <span className="text-[#FC46AA]">JosseyCodes Academy</span>
        </h2>
        
        <div className="mb-8 md:mb-12">
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-6">
            Established in 2013, JosseyCodes Academy has been at the forefront of providing quality secondary education 
            that balances academic excellence with character development. Our mission is to nurture well-rounded individuals 
            who are prepared for university education and beyond.
          </p>
          <p className="text-gray-600 text-center max-w-3xl mx-auto">
            Located on a spacious campus in Lagos, we offer a conducive learning environment with modern facilities, 
            experienced educators, and a curriculum that meets both national and international standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Mission */}
          <div className="p-6 md:p-8 rounded-lg border border-josseypink1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">Our Mission</h3>
            <p className="text-gray-700">
              To provide a transformative educational experience that develops students into critical thinkers, 
              ethical leaders, and lifelong learners who are prepared to excel in university and make meaningful 
              contributions to society.
            </p>
          </div>

          {/* Vision */}
          <div className="p-6 md:p-8 rounded-lg border border-josseypink1">
            <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">Our Vision</h3>
            <p className="text-gray-700">
              To be the leading secondary school in Nigeria recognized for academic excellence, character development, 
              and innovation in education, producing graduates who become change-makers in their communities and the world.
            </p>
          </div>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link href="/admission" className="inline-block px-6 py-3 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors font-medium">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  )
}