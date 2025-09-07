export default function Stats() {
  const stats = [
    { number: "98%", label: "School Admission Rate" },
    { number: "15:1", label: "Student-Teacher Ratio" },
    { number: "10+", label: "Years of Excellence" },
    { number: "500+", label: "Successful Graduates" }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4">
              <div className="text-2xl md:text-3xl font-bold text-[#FC46AA] mb-2">{stat.number}</div>
              <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}