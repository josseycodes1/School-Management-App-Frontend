import Navbar from '@/components/HomePageComponents/Navbar'
import HeroSection from '@/components/HomePageComponents/HeroSection'
import AboutUs from '@/components/HomePageComponents/AboutUs'
import Stats from '@/components/HomePageComponents/Stats'
import Features from '@/components/HomePageComponents/Features'
import Programs from '@/components/HomePageComponents/Programs'
import Testimonials from '@/components/HomePageComponents/Testimonials'
import PortalAccess from '@/components/HomePageComponents/PortalAccess'
import CallToAction from '@/components/HomePageComponents/CallToAction'
import Footer from '@/components/HomePageComponents/Footer'
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutUs />
      <PortalAccess />
      <Stats />
      <Features />
      <Programs />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  )
}