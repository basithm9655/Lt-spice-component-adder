import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Components from './components/Components'
import HowItWorks from './components/HowItWorks'
import Community from './components/Community'
import Footer from './components/Footer'

function App() {
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('section-visible')
            e.target.classList.remove('section-hidden')
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.section-hidden').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0a1a] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Components />
      <HowItWorks />
      <Community />
      <Footer />
    </div>
  )
}

export default App
