"use client";
import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Admissions", href: "/admissions" },
        { name: "Academic Calendar", href: "/calendar" },
        { name: "School Fees", href: "/fees" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "News & Events", href: "/news" },
        { name: "Photo Gallery", href: "/gallery" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Policies",
      links: [
        { name: "Admission Policy", href: "/admission-policy" },
        { name: "Code of Conduct", href: "/conduct" },
        { name: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="bg-josseypink1 text-white py-4 md:py-8 px-3 md:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-8">
        {/* Logo + About */}
        <div className="lg:col-span-2">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-josseypink1 mr-2 flex items-center justify-center text-white text-sm font-bold">
              JC
            </div>
            <h3 className="text-lg font-bold">JosseyCodes Academy</h3>
          </div>
          <p className="text-gray-300 text-sm mb-2 leading-snug">
            Empowering the next generation of leaders through quality secondary
            education since 2013.
          </p>
          <div className="flex space-x-3">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              FB
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              TW
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              IG
            </a>
          </div>
        </div>

        {/* Footer Links */}
        {footerLinks.map((section, index) => (
          <div key={index}>
            {/* Mobile (Accordion) */}
            <div
              className="flex justify-between items-center md:hidden cursor-pointer py-2 border-b border-white/20"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h4 className="font-semibold text-base">{section.title}</h4>
              <span>{openIndex === index ? "−" : "+"}</span>
            </div>
            {openIndex === index && (
              <ul className="space-y-1 mt-1 md:hidden">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors block text-sm py-0.5"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Desktop (Always Visible) */}
            <div className="hidden md:block">
              <h4 className="font-semibold mb-2 text-base">{section.title}</h4>
              <ul className="space-y-1">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors block text-sm py-0.5"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer */}
      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-white text-center text-gray-300 text-xs">
        <p>
          © {new Date().getFullYear()} JosseyCodes Academy. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
