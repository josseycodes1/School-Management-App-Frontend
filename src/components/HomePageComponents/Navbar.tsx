'use client';
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-josseypink1 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${
              isScrolled ? 'bg-josseypink1' : 'bg-white'
            } mr-3 flex items-center justify-center ${
              isScrolled ? 'text-white' : 'text-josseypink1'
            } font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-200`}>
              JC
            </div>
            <h1 className={`text-xl md:text-2xl font-bold ${
              isScrolled ? 'text-josseypink1' : 'text-white'
            } tracking-tight`}>
              JosseyCodes Academy
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/courses" 
              className={`font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-josseypink1/10 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-josseypink1' 
                  : 'text-white hover:text-[#F8BBD9]'
              }`}
            >
              Courses
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-josseypink1/10 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-josseypink1' 
                  : 'text-white hover:text-[#F8BBD9]'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-josseypink1/10 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-josseypink1' 
                  : 'text-white hover:text-[#F8BBD9]'
              }`}
            >
              Contact
            </Link>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <Link 
              href="/log-in" 
              className={`font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-josseypink1/10 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-josseypink1' 
                  : 'text-white hover:text-[#F8BBD9]'
              }`}
            >
              Log in
            </Link>
            <Link 
              href="/sign-up" 
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isScrolled
                  ? 'bg-josseypink1 text-white hover:bg-[#D63384]'
                  : 'bg-white text-josseypink1 hover:bg-[#F8BBD9] hover:text-white'
              }`}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden flex flex-col space-y-1.5 w-8 h-8 justify-center items-center transition-colors ${
              isScrolled ? 'text-josseypink1' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className={`rounded-lg p-4 space-y-2 border ${
            isScrolled 
              ? 'bg-white/95 backdrop-blur-md border-gray-200 shadow-lg' 
              : 'bg-white/10 backdrop-blur-sm border-white/20'
          }`}>
            <Link 
              href="/courses" 
              className={`block font-medium transition-colors duration-200 px-4 py-3 rounded-lg ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-josseypink1/10 hover:text-josseypink1' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              href="/about" 
              className={`block font-medium transition-colors duration-200 px-4 py-3 rounded-lg ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-josseypink1/10 hover:text-josseypink1' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`block font-medium transition-colors duration-200 px-4 py-3 rounded-lg ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-josseypink1/10 hover:text-josseypink1' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="border-t border-gray-200/50 pt-2 mt-2">
              <Link 
                href="/log-in" 
                className={`block font-medium transition-colors duration-200 px-4 py-3 rounded-lg ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-josseypink1/10 hover:text-josseypink1' 
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                href="/sign-up" 
                className="block text-center px-4 py-3 bg-josseypink1 text-white rounded-lg font-semibold hover:bg-[#D63384] transition-all duration-200 shadow-md mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}