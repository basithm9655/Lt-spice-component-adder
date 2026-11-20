import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = ['Home', 'Features', 'Components', 'How It Works', 'Community']

function WindowsIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5.557L10.5 4.5V11.5H3V5.557ZM11.5 4.357L21 3V11.5H11.5V4.357ZM3 12.5H10.5V19.5L3 18.443V12.5ZM11.5 12.5H21V21L11.5 19.643V12.5Z" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (item) => {
    setMobileOpen(false)
    const id = item.toLowerCase().replace(/\s+/g, '-')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(15,10,26,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(123,57,252,0.15)' : 'none',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '14px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
              boxShadow: '0 0 14px rgba(123,57,252,0.4)',
            }}>
              <img src="/icon.ico" alt="LTspice Component Adder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 14, color: 'white' }}>LTspice</div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 11, color: '#a855f7' }}>Component Adder</div>
            </div>
          </div>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hide-mobile">
            {links.map(link => (
              <button key={link} onClick={() => handleNav(link)} style={{
                fontFamily: 'Manrope', fontWeight: 500, fontSize: 14,
                color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none',
                cursor: 'pointer', transition: 'color 0.2s', padding: 0,
              }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Download button */}
          <a href="/ltspice-component-adder.zip" download style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10,
            fontFamily: 'Cabin', fontWeight: 700, fontSize: 14, color: 'white',
            background: '#7b39fc', textDecoration: 'none',
            boxShadow: '0 4px 18px rgba(123,57,252,0.45)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
            className="hide-mobile"
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            <WindowsIcon size={15} />
            Download Free (.zip)
          </a>

          {/* Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{
            background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4,
          }} className="show-mobile">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: 'rgba(10,6,20,0.97)', backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
        opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'all' : 'none',
        transition: 'opacity 0.3s ease',
      }}>
        {links.map(link => (
          <button key={link} onClick={() => handleNav(link)} style={{
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 24,
            color: 'rgba(255,255,255,0.9)', background: 'none', border: 'none', cursor: 'pointer',
          }}>{link}</button>
        ))}
        <a href="/ltspice-component-adder.zip" download onClick={() => setMobileOpen(false)} style={{
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 16,
          padding: '14px 32px', borderRadius: 12,
          fontFamily: 'Cabin', fontWeight: 700, fontSize: 16, color: 'white',
          background: '#7b39fc', textDecoration: 'none',
          boxShadow: '0 6px 24px rgba(123,57,252,0.5)',
        }}>
          <WindowsIcon size={18} />
          Download for Windows (.zip)
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </>
  )
}
