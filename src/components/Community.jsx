import { GitBranch, Globe, AppWindow } from 'lucide-react'

export default function Community() {
  return (
    <section id="community" className="section-pad" style={{ position: 'relative' }}>
      <style>{`
        .section-pad { padding: 112px 0; }
        .banner-pad { padding: 48px 32px; }
        .comm-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        @media (max-width: 768px) {
          .section-pad { padding: 64px 0; }
          .banner-pad { padding: 32px 20px; }
          .comm-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(123,57,252,0.1) 0%, transparent 65%)'
      }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Banner */}
        <div className="section-hidden glass-card banner-pad" style={{
          borderRadius: 24, textAlign: 'center', marginBottom: 40,
          background: 'rgba(43,35,68,0.5)', border: '1px solid rgba(123,57,252,0.2)',
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 24,
            background: 'rgba(123,57,252,0.15)', border: '1px solid rgba(123,57,252,0.3)',
            fontFamily: 'Cabin', fontSize: 13, fontWeight: 500, color: '#c4b5fd',
          }}>
            ✦ Open Source Community
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif", color: 'white',
            fontSize: 'clamp(30px, 5vw, 52px)', lineHeight: 1.15,
            marginBottom: 20, margin: '0 auto 20px',
          }}>
            Built by the community,<br/>
            <em style={{ fontStyle: 'italic', color: '#a855f7' }}>for the community</em>
          </h2>
          <p style={{
            fontFamily: 'Inter', color: 'rgba(255,255,255,0.6)', fontSize: 17,
            maxWidth: 580, margin: '0 auto 32px', lineHeight: 1.7, textAlign: 'center'
          }}>
            Got a working LTspice component? Share it directly from inside the app with one click.
            Help engineers worldwide and contribute to the open-source library.
          </p>
          <a href="https://github.com/Gokul25122007/Lt-Spice-models" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '14px 28px', borderRadius: 10,
            background: '#7b39fc', color: 'white', textDecoration: 'none',
            fontFamily: 'Cabin', fontWeight: 600, fontSize: 15,
            boxShadow: '0 6px 24px rgba(123,57,252,0.4)',
            transition: 'opacity 0.2s, transform 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            <GitBranch size={18} />
            View on GitHub
          </a>
        </div>

        {/* 3 info cards */}
        <div className="comm-grid" style={{
          display: 'grid',
          gap: 20,
        }}>
          {[
            {
              icon: <Globe size={20} />,
              color: '#06b6d4',
              title: 'Online Library',
              desc: 'Browse community components when connected. Always updated with new verified parts.',
              note: 'Requires internet',
            },
            {
              icon: <AppWindow size={20} />,
              color: '#7b39fc',
              title: 'Share via the App',
              desc: 'Sharing components with the community is done inside the app — not on this page. Download the app to contribute.',
              note: 'In-app only',
            },
            {
              icon: <GitBranch size={20} />,
              color: '#a484d7',
              title: 'Open Source',
              desc: 'The entire app and built-in component library are open source. Fork, improve, share.',
              note: 'MIT Licensed',
            },
          ].map((card, i) => (
            <div key={card.title} className="section-hidden glass-card" style={{
              borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column',
              transitionDelay: `${i * 100}ms`, transition: 'transform 0.3s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${card.color}20`, color: card.color, marginBottom: 16, flexShrink: 0
              }}>
                {card.icon}
              </div>
              <h3 style={{
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: 'white', marginBottom: 8
              }}>{card.title}</h3>
              <p style={{
                fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7, margin: '0 0 16px 0', flexGrow: 1
              }}>{card.desc}</p>
              <div>
                <span style={{
                  display: 'inline-block', padding: '4px 10px', borderRadius: 999,
                  fontFamily: 'Cabin', fontWeight: 500, fontSize: 11,
                  background: `${card.color}18`, color: card.color
                }}>
                  {card.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
