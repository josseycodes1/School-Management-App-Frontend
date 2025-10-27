"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/HomePageComponents/Navbar";

const AdmissionPage = () => {
  const [waitlistForm, setWaitlistForm] = useState({
    name: "",
    email: "",
    phone: "",
    studentGrade: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWaitlistForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Waitlist form submitted:", waitlistForm);
    setSubmitted(true);
    
    
    setTimeout(() => {
      setSubmitted(false);
      setWaitlistForm({
        name: "",
        email: "",
        phone: "",
        studentGrade: "",
        message: ""
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <div className="relative text-white py-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/schoolchildren3.jpg"
            alt="School children learning"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay with gradient instead of solid color */}
          <div className="absolute inset-0 bg-gradient-to-r from-josseypink1/80 to-josseypink2/80"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Admissions</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Join our educational community where excellence meets opportunity
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Admissions Status */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/3 bg-josseypink1 text-white p-8 flex flex-col justify-center">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">Admissions Status</h2>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold">Currently Closed</p>
              </div>
            </div>
            <div className="p-8 md:w-2/3">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Students Are in Session</h3>
              <p className="text-gray-600 mb-4">
                We are not presently taking new admissions as our students are currently in session. 
                We believe in maintaining a stable learning environment without disruptions mid-term.
              </p>
              <p className="text-gray-600 mb-6">
                However, we understand your interest in our institution and would be delighted to 
                have you join our waitlist for the next admission period.
              </p>
              <div className="bg-josseypink2 border-l-4 border-josseypink5 p-4 mb-6">
                <p className="text-blue-700">
                  <span className="font-semibold">Next admission period:</span> January 2024
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Waitlist Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Join Our Waitlist</h2>
            
            {submitted ? (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <p className="text-green-700">
                  Thank you for your interest! We've added you to our waitlist and will contact you when admissions reopen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={waitlistForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={waitlistForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={waitlistForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                    placeholder="(123) 456-7890"
                  />
                </div>
                
                <div>
                  <label htmlFor="studentGrade" className="block text-sm font-medium text-gray-700 mb-1">
                    Interested Grade Level
                  </label>
                  <select
                    id="studentGrade"
                    name="studentGrade"
                    value={waitlistForm.studentGrade}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                  >
                    <option value="">Select grade level</option>
                    <option value="1">JSS1</option>
                    <option value="2">JSS2</option>
                    <option value="3">JSS3</option>
                    <option value="4">SS1</option>
                    <option value="5">SS2</option>
                    <option value="6">SS3</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={waitlistForm.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-josseypink1 focus:border-josseypink1"
                    placeholder="Any specific questions or information you'd like to share..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-josseypink1 text-white py-3 rounded-lg hover:bg-josseypink2 transition-colors font-semibold"
                >
                  Join Waitlist
                </button>
              </form>
            )}
          </div>

          {/* Login/Signup Section */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing Users</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Students
                  </h3>
                  <p className="text-gray-600 mb-4">Access your student portal to view assignments, grades, and more.</p>
                  <div className="flex space-x-3">
                    <Link 
                      href="/login/student" 
                      className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup/student" 
                      className="flex-1 border border-josseypink1 text-josseypink1 py-2 rounded-lg text-center hover:bg-josseypink1 hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Parents
                  </h3>
                  <p className="text-gray-600 mb-4">Monitor your child's progress, attendance, and communicate with teachers.</p>
                  <div className="flex space-x-3">
                    <Link 
                      href="/login/parent" 
                      className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup/parent" 
                      className="flex-1 border border-josseypink1 text-josseypink1 py-2 rounded-lg text-center hover:bg-josseypink1 hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-josseypink1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Teachers
                  </h3>
                  <p className="text-gray-600 mb-4">Access your teacher portal to manage classes, assignments, and grades.</p>
                  <div className="flex space-x-3">
                    <Link 
                      href="/login/teacher" 
                      className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup/teacher" 
                      className="flex-1 border border-josseypink1 text-josseypink1 py-2 rounded-lg text-center hover:bg-josseypink1 hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-4">
                Our admissions team is here to answer any questions you may have about our programs, 
                admission process, or waitlist.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-josseypink1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-josseypink1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">admissions@schoolname.edu</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-josseypink1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">123 Education Street, City, State 12345</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPage;