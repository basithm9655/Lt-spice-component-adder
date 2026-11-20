import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4'

function WindowsIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5.557L10.5 4.5V11.5H3V5.557ZM11.5 4.357L21 3V11.5H11.5V4.357ZM3 12.5H10.5V19.5L3 18.443V12.5ZM11.5 12.5H21V21L11.5 19.643V12.5Z"/>
    </svg>
  )
}

export default function Hero() {
  const starsRef = useRef(null)

  useEffect(() => {
    if (!starsRef.current) return
    const container = starsRef.current
    container.innerHTML = ''
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div')
      const size = Math.random() * 2.5 + 0.5
      star.className = 'star'
      star.style.cssText = `
        position: absolute;
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%; top:${Math.random() * 100}%;
        animation-duration:${Math.random() * 3 + 2}s;
        animation-delay:${Math.random() * 4}s;
        opacity:${Math.random() * 0.6 + 0.1};
        background: white; border-radius: 50%;
      `
      container.appendChild(star)
    }
  }, [])

  return (
    <section id="home" className="hero-section" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <style>{`
        .hero-section { padding: 120px 24px 80px; }
        .hero-buttons { flex-direction: row; }
        .hero-btn { width: auto; }
        .hero-stats { padding: 24px 40px; gap: 32px; }
        @media (max-width: 768px) {
          .hero-section { padding: 100px 20px 50px; }
          .hero-title { font-size: 42px !important; line-height: 1.1 !important; margin-bottom: 16px !important; }
          .hero-subtitle { font-size: 16px !important; line-height: 1.6 !important; margin-bottom: 32px !important; }
          .hero-pill { transform: scale(0.95); margin-bottom: 24px !important; }
          .hero-buttons { flex-direction: column; width: 100%; max-width: 320px; gap: 12px !important; margin-bottom: 48px !important; }
          .hero-btn { width: 100%; padding: 14px 20px !important; font-size: 15px !important; }
          .hero-stats { padding: 24px 16px; border-radius: 16px !important; display: grid !important; grid-template-columns: 1fr 1fr; gap: 24px 12px !important; }
          .hero-stats > div { flex: none !important; }
          .stat-value { font-size: 26px !important; }
          .stat-label { font-size: 12px !important; white-space: normal !important; line-height: 1.3 !important; }
        }
      `}</style>
      <video
        src={VIDEO_URL}
        autoPlay loop muted playsInline
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0
        }}
      />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(15,10,26,0.65) 0%, rgba(15,10,26,0.5) 50%, rgba(15,10,26,0.9) 100%)'
      }} />
      <div ref={starsRef} style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />

      {/* Hero content */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        width: '100%', maxWidth: 900, margin: '0 auto'
      }}>
        {/* Tagline */}
        <div className="hero-pill animate-fadeInUp" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '6px 16px', borderRadius: 999, marginBottom: 32,
          background: 'rgba(85,80,110,0.4)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(164,132,215,0.5)',
        }}>
          <span style={{
            background: '#7b39fc', padding: '4px 10px', borderRadius: 6,
            fontFamily: 'Cabin', fontWeight: 600, fontSize: 12, color: 'white', lineHeight: 1
          }}>New</span>
          <span style={{ fontFamily: 'Cabin', fontWeight: 500, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
            One-click LTspice component installation
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-title animate-fadeInUp delay-100" style={{
          fontFamily: "'Instrument Serif', serif", color: 'white',
          fontSize: 'clamp(38px, 8vw, 96px)', lineHeight: 1.05,
          marginBottom: 24, margin: '0 auto 24px'
        }}>
          Install LTspice components<br />
          <em style={{ fontStyle: 'italic', color: '#a484d7' }}>instantly</em> &amp; effortlessly
        </h1>

        {/* Subtext */}
        <p className="hero-subtitle animate-fadeInUp delay-200" style={{
          fontFamily: 'Inter', fontSize: 'clamp(16px, 2vw, 18px)', color: 'rgba(255,255,255,0.7)',
          maxWidth: 680, margin: '0 auto 40px', lineHeight: 1.6
        }}>
          Add D Flip-Flops, Op-Amps, 74LS series and more in one click. Get component
          code from ChatGPT, Gemini or Claude — paste or upload it, auto-added to LTspice.
        </p>

        {/* Buttons */}
        <div className="hero-buttons animate-fadeInUp delay-300" style={{
          display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 64
        }}>
          <a href="/ltspice-component-adder.zip" download className="hero-btn" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '16px 32px', borderRadius: 12,
            background: '#7b39fc', color: 'white',
            fontFamily: 'Cabin', fontWeight: 600, fontSize: 16, textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(123,57,252,0.5)',
            transition: 'opacity 0.2s, transform 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            <WindowsIcon size={20} />
            Download for Windows
          </a>
          <a href="#components" className="hero-btn" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '16px 32px', borderRadius: 12,
            background: '#2b2344', color: '#f6f7f9',
            border: '1px solid rgba(123,57,252,0.3)', textDecoration: 'none',
            fontFamily: 'Cabin', fontWeight: 600, fontSize: 16,
            transition: 'background 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#362c54'}
            onMouseLeave={e => e.currentTarget.style.background = '#2b2344'}
            onClick={e => { e.preventDefault(); document.getElementById('components')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            View 59 Components
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats animate-fadeInUp delay-400" style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          borderRadius: 20,
          background: 'rgba(43,35,68,0.45)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(123,57,252,0.2)', width: '100%', maxWidth: 700
        }}>
          {[
            { value: '59', label: 'Verified Models' },
            { value: '100%', label: 'Physical Accuracy' },
            { value: '1-Click', label: 'Instant Add' },
            { value: 'Free', label: 'Portable App' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center', flex: '1 1 120px' }}>
              <div className="stat-value" style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 28, color: 'white', marginBottom: 4 }}>
                {stat.value}
              </div>
              <div className="stat-label" style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
