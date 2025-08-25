export default function Features() {
  const features = [
    {
      title: "Academic Excellence",
      description: "Rigorous curriculum from JSS1 to SS3 with certified teachers",
      icon: "🎓"
    },
    {
      title: "Modern Facilities",
      description: "State-of-the-art classrooms, science labs, and computer centers",
      icon: "🏫"
    },
    {
      title: "Holistic Development", 
      description: "Sports, arts, and character-building programs",
      icon: "🌟"
    },
    {
      title: "Parent Partnership",
      description: "Regular updates and involvement in your child's education",
      icon: "👪"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
          Why Choose <span className="text-[#FC46AA]">JosseyCodes Academy</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl md:text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}