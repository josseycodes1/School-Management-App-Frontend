import Link from 'next/link'

export default function Footer() {
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
    <footer className="bg-josseypink1 text-white py-12 px-4 md:px-6">
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
      
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white text-center text-gray-300 text-sm">
        <p>© {new Date().getFullYear()} JosseyCodes Academy. All rights reserved.</p>
      </div>
    </footer>
  )
}