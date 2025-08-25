// app/page.tsx
import Link from 'next/link'

export default function Home() {
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

  const stats = [
    { number: "98%", label: "University Admission Rate" },
    { number: "15:1", label: "Student-Teacher Ratio" },
    { number: "10+", label: "Years of Excellence" },
    { number: "500+", label: "Successful Graduates" }
  ];

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Admissions", href: "/admissions" },
        { name: "Academic Calendar", href: "/calendar" },
        { name: "School Fees", href: "/fees" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "News & Events", href: "/news" },
        { name: "Photo Gallery", href: "/gallery" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Policies",
      links: [
        { name: "Admission Policy", href: "/admission-policy" },
        { name: "Code of Conduct", href: "/conduct" },
        { name: "Privacy Policy", href: "/privacy" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 rounded-full bg-[#FC46AA] mr-3 flex items-center justify-center text-white font-bold">
            JC
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">JosseyCodes Academy</h1>
        </div>
        <div className="flex space-x-2 md:space-x-4">
          <Link href="/log-in" className="px-3 py-2 md:px-4 md:py-2 text-[#FC46AA] font-medium hover:text-[#F699CD] transition-colors text-sm md:text-base">
            Login
          </Link>
          <Link href="/sign-up" className="px-3 py-2 md:px-4 md:py-2 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors text-sm md:text-base">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 text-center bg-gradient-to-r from-pink-50 to-purple-50">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
          Excellence in <span className="text-[#FC46AA]">Secondary</span> Education
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 md:mb-10">
          Preparing students from JSS1 to SS3 for academic success and character development in a nurturing environment.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/admissions" className="px-6 py-3 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors font-medium">
            Begin Admission Process
          </Link>
          <Link href="/tour" className="px-6 py-3 border border-[#FC46AA] text-[#FC46AA] rounded-md hover:bg-[#FC46AA]/10 transition-colors font-medium">
            Schedule a School Tour
          </Link>
        </div>
      </section>

      {/* About Us Section */}
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
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 md:p-8 rounded-lg border border-pink-100">
              <div className="text-4xl text-[#FC46AA] mb-4">🎯</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide a transformative educational experience that develops students into critical thinkers, 
                ethical leaders, and lifelong learners who are prepared to excel in university and make meaningful 
                contributions to society.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 md:p-8 rounded-lg border border-purple-100">
              <div className="text-4xl text-[#FC46AA] mb-4">🔭</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading secondary school in Nigeria recognized for academic excellence, character development, 
                and innovation in education, producing graduates who become change-makers in their communities and the world.
              </p>
            </div>
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link href="/about" className="inline-block px-6 py-3 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors font-medium">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Features Section */}
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

      {/* Programs Section */}
      <section className="py-12 md:py-16 bg-gray-50">
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

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
            What People Say About <span className="text-[#FC46AA]">Us</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-lg border border-gray-100"
              >
                <div className="text-[#FC46AA] text-4xl mb-4">"</div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-800">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#FC46AA] to-[#F699CD] text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Parent & Student Portal</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Existing parents, students, and staff can access our portal for grades, assignments, and school communications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/portal-login" className="px-6 py-3 bg-white text-[#FC46AA] rounded-md hover:bg-gray-100 transition-colors font-medium">
              Portal Login
            </Link>
            <Link href="/portal-help" className="px-6 py-3 border border-white text-white rounded-md hover:bg-white/10 transition-colors font-medium">
              Portal Help
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-gray-800 text-white">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FC46AA] mr-3 flex items-center justify-center text-white font-bold">
                JC
              </div>
              <h3 className="text-xl font-bold">JosseyCodes Academy</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering the next generation of leaders through quality secondary education since 2013.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                {/* Icon would go here */}
                FB
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                TW
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                IG
              </a>
            </div>
          </div>
          
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4 text-lg">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-300 text-sm">
          <p>© {new Date().getFullYear()} JosseyCodes Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}