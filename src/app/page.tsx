// app/page.tsx
import Link from 'next/link'

export default function Home() {
  const features = [
    {
      title: "For Students",
      description: "Interactive learning platform with progress tracking",
      icon: "🎓"
    },
    {
      title: "For Parents",
      description: "Real-time updates on your child's performance",
      icon: "👪"
    },
    {
      title: "For Teachers", 
      description: "Comprehensive tools for classroom management",
      icon: "👩‍🏫"
    }
  ];

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Admissions", href: "/admissions" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "FAQ", href: "/faq" },
        { name: "Privacy Policy", href: "/privacy" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#FC46AA] mr-3"></div>
          <h1 className="text-2xl font-bold text-gray-800">JosseyCodes Academy</h1>
        </div>
        <div className="flex space-x-4">
          <Link href="/log-in" className="px-4 py-2 text-[#FC46AA] font-medium hover:text-[#F699CD] transition-colors">
            Login
          </Link>
          <Link href="/sign-up" className="px-4 py-2 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Empowering <span className="text-[#FC46AA]">Future</span> Leaders
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Quality education for students, comprehensive tools for parents, and powerful resources for teachers.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/sign-up" className="px-8 py-3 bg-[#FC46AA] text-white rounded-md hover:bg-[#F699CD] transition-colors font-medium">
            Get Started
          </Link>
          <Link href="/about" className="px-8 py-3 border border-[#FC46AA] text-[#FC46AA] rounded-md hover:bg-[#FC46AA]/10 transition-colors font-medium">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose <span className="text-[#FC46AA]">JosseyCodes</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-500 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">JosseyCodes Academy</h3>
            <p className="text-gray-300">Empowering students through quality education since 2023.</p>
          </div>
          
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-300">123 Education Street</p>
            <p className="text-gray-300">Lagos, Nigeria</p>
            <p className="text-gray-300">info@josseycodes.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}