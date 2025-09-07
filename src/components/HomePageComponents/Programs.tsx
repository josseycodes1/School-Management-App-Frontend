import Link from 'next/link'

export default function Programs() {
  const programs = [
    {
      level: "Junior Secondary (JSS1 - JSS3)",
      description: "Foundation building with core subjects and introduction to technology"
    },
    {
      level: "Senior Secondary (SS1 - SS3)",
      description: "Specialized tracks in Sciences, Arts, and Commercial subjects"
    },
    {
      level: "Extracurricular Programs",
      description: "Sports, coding club, debate society, and artistic development"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Pink background container with rounded edges */}
        <div className="bg-josseypink1 rounded-2xl shadow-xl p-10 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 md:mb-14">
            Our <span className="text-white">Academic Programs</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {programs.map((program, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{program.level}</h3>
                <p className="text-gray-600">{program.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 md:mt-16">
            <Link href="/academics" className="inline-block px-8 py-3 bg-white text-[#FC46AA] rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium shadow-md hover:shadow-lg">
              View Full Curriculum
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}