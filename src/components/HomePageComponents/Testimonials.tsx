export default function Testimonials() {
  const testimonials = [
    {
      quote: "JosseyCodes Academy transformed my child's approach to learning. The teachers are dedicated and the facilities are exceptional.",
      author: "Mrs. Adekunle",
      role: "Parent of SS2 Student"
    },
    {
      quote: "The balanced curriculum helped me develop both academically and in extracurricular activities. I'm well-prepared for university.",
      author: "Chinedu Okoro",
      role: "Graduate, Class of 2022"
    },
    {
      quote: "Teaching at JosseyCodes is rewarding. We have small class sizes that allow for personalized attention to each student.",
      author: "Mr. Johnson",
      role: "Mathematics Teacher"
    }
  ];

  return (
    <section className="relative min-h-[500px] flex items-center justify-center py-20 px-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/website6.jpg')" }}
      >
        {/* overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 md:mb-14 drop-shadow-md">
          What People Say About <span className="text-white">Us</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg"
            >
              <div className="text-[#FC46AA] text-4xl mb-4">"</div>
              <p className="text-gray-800 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-800">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}