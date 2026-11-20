import { GitBranch, Heart, ExternalLink } from 'lucide-react'

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Components', href: '#components' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Download', href: '/ltspice-component-adder.exe', download: true },
  ],
  Community: [
    { label: 'Models Library', href: '#components' },
    { label: 'Open Source', href: '#community' },
  ],
  Resources: [
    { label: 'Custom Component Guide', href: '#how-it-works' },
    { label: 'File Routing Guide', href: '#how-it-works' },
    { label: 'LTspice Tips', href: '#features' },
  ],
}

function WindowsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 5.557L10.5 4.5V11.5H3V5.557ZM11.5 4.357L21 3V11.5H11.5V4.357ZM3 12.5H10.5V19.5L3 18.443V12.5ZM11.5 12.5H21V21L11.5 19.643V12.5Z"/>
    </svg>
  )
}

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id.replace('#', ''))
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{
      position: 'relative', borderTop: '1px solid rgba(123,57,252,0.15)',
      background: 'rgba(10,6,20,0.95)'
    }}>
      <style>{`
        .footer-top { padding: 80px 24px; }
        .footer-links-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        .footer-bottom { flex-direction: row; justify-content: space-between; }
        @media (max-width: 768px) {
          .footer-top { padding: 60px 20px !important; }
          .footer-links-grid { grid-template-columns: 1fr 1fr !important; gap: 32px 16px !important; }
          .footer-brand { grid-column: 1 / -1 !important; }
          .footer-bottom { flex-direction: column !important; align-items: center; justify-content: center; text-align: center; gap: 12px !important; }
          .dl-btn { width: 100%; padding: 14px 20px !important; font-size: 14px !important; }
        }
      `}</style>
      {/* Top download CTA */}
      <div className="footer-top" style={{
        position: 'relative', textAlign: 'center', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(123,57,252,0.15) 0%, transparent 65%)'
        }} />
        <div style={{
          position: 'relative', maxWidth: 672, margin: '0 auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          <img src="/icon.ico" alt="LTspice Component Adder" style={{
            width: 56, height: 56, borderRadius: 16, marginBottom: 20,
            boxShadow: '0 0 30px rgba(123,57,252,0.4)', objectFit: 'cover'
          }} />
          <h2 style={{
            fontFamily: "'Instrument Serif', serif", color: 'white',
            fontSize: 'clamp(28px, 5vw, 46px)', lineHeight: 1.15,
            marginBottom: 16, margin: '0 auto 16px'
          }}>
            Start adding LTspice components<br/>
            <em style={{ fontStyle: 'italic', color: '#a855f7' }}>the smart way</em>
          </h2>
          <p style={{
            fontFamily: 'Inter', color: 'rgba(255,255,255,0.55)', fontSize: 16,
            marginBottom: 32, margin: '0 auto 32px'
          }}>
            Free, portable, no installation required. Just download and run.
          </p>
          <a href="/ltspice-component-adder.exe" download className="dl-btn" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            padding: '16px 32px', borderRadius: 12, textDecoration: 'none',
            background: '#7b39fc', color: 'white',
            fontFamily: 'Cabin', fontWeight: 600, fontSize: 16,
            boxShadow: '0 8px 32px rgba(123,57,252,0.5)',
            transition: 'opacity 0.2s, transform 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            <WindowsIcon />
            Download for Windows — Free
          </a>
          <p style={{
            fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.3)',
            marginTop: 16, margin: '16px auto 0'
          }}>
            Windows 10/11 · Portable EXE · No install needed
          </p>
        </div>
      </div>

      {/* Links grid */}
      <div style={{
        maxWidth: 1152, margin: '0 auto', padding: '48px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div className="footer-links-grid" style={{
          display: 'grid',
          gap: 32, marginBottom: 48
        }}>
          {/* Brand */}
          <div style={{ gridColumn: '1 / -1', maxWidth: 300 }}>
            <style>{`@media (min-width: 768px) { .footer-brand { grid-column: auto !important; } }`}</style>
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 0 15px rgba(123,57,252,0.35)'
              }}>
                <img src="/icon.ico" alt="icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, color: 'white', fontSize: 15 }}>LTspice</div>
                <div style={{ fontFamily: 'Manrope', fontWeight: 500, color: '#a855f7', fontSize: 12 }}>Component Adder</div>
              </div>
            </div>
            <p style={{
              fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.7, margin: '0 0 16px 0'
            }}>
              One-click component installer for LTspice. Free &amp; open-source.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>By</span>
              <a href="https://www.instagram.com/bazi.t_h/" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#a855f7', textDecoration: 'none',
                transition: 'color 0.2s'
              }} onMouseEnter={e => e.target.style.color = '#c084fc'} onMouseLeave={e => e.target.style.color = '#a855f7'}>
                Basi.
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 style={{
                fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.7)',
                marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1
              }}>{group}</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {items.map(item => (
                  <li key={item.label}>
                    {item.download ? (
                      <a href={item.href} download style={{
                        fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.45)',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'color 0.2s'
                      }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
                        <WindowsIcon size={14} />
                        {item.label}
                      </a>
                    ) : item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" style={{
                        fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.45)',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                        transition: 'color 0.2s'
                      }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
                        {item.label}
                        <ExternalLink size={11} />
                      </a>
                    ) : (
                      <button onClick={() => scrollTo(item.href)} style={{
                        fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.45)',
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
                        transition: 'color 0.2s'
                      }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom" style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16,
          paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              © 2025 LTspice Component Adder · Made with
            </span>
            <Heart size={13} color="#a855f7" />
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              by <a href="https://www.instagram.com/bazi.t_h/" target="_blank" rel="noopener noreferrer" style={{
                color: '#a855f7', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s'
              }} onMouseEnter={e => e.target.style.color = '#c084fc'} onMouseLeave={e => e.target.style.color = '#a855f7'}>Basi.</a>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            <span>Verified SPICE Components & Models</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
