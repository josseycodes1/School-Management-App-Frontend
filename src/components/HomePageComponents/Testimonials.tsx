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
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
          What People Say About <span className="text-[#FC46AA]">Us</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-josseypink1 p-6 rounded-lg border border-gray-100"
            >
              <div className="text-[#FC46AA] text-4xl mb-4">"</div>
              <p className="text-white italic mb-4">"{testimonial.quote}"</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-white">{testimonial.author}</p>
                <p className="text-sm text-white">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}