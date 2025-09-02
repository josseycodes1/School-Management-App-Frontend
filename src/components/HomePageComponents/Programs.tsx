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
    <section className="py-12 md:py-16 bg-josseypink1">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
          Our <span className="text-[#FC46AA]">Academic Programs</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{program.level}</h3>
              <p className="text-gray-600">{program.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 md:mt-12">
          <Link href="/academics" className="inline-block px-6 py-3 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors font-medium">
            View Full Curriculum
          </Link>
        </div>
      </div>
    </section>
  )
}