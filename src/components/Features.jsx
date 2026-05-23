import { Zap, Brain, FolderSearch, Package, Upload, Globe } from 'lucide-react'

const features = [
  {
    icon: <Zap size={22} />,
    title: 'One-Click Install',
    desc: 'Select components, click Install — LTspice is ready instantly. No manual file copying or folder navigation.',
    color: '#f59e0b',
  },
  {
    icon: <Brain size={22} />,
    title: 'AI-Assisted Adding',
    desc: 'Ask ChatGPT, Gemini, or Claude for a component. Paste the .asy & .lib/.sub code (or upload files) — auto-installed to LTspice.',
    color: '#7b39fc',
  },
  {
    icon: <FolderSearch size={22} />,
    title: 'Auto LTspice Detection',
    desc: 'The app auto-detects your LTspice installation folder. Browse manually only if needed.',
    color: '#06b6d4',
  },
  {
    icon: <Package size={22} />,
    title: 'Smart File Routing',
    desc: '.asy files go to lib/sym/, .lib & .sub files go to lib/sub/ — automatically sorted by category.',
    color: '#10b981',
  },
  {
    icon: <Upload size={22} />,
    title: 'Share via the App',
    desc: 'Found a great component? Share it directly from inside the app — not on this page. Shared parts appear in the online library.',
    color: '#f43f5e',
  },
  {
    icon: <Globe size={22} />,
    title: 'Online Library',
    desc: 'Browse community-contributed components when online. Always growing with new verified parts.',
    color: '#a484d7',
  },
]

export default function Features() {
  return (
    <section id="features" className="section-pad" style={{ position: 'relative' }}>
      <style>{`
        .section-pad { padding: 112px 0; }
        .feature-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
        @media (max-width: 768px) {
          .section-pad { padding: 64px 0; }
          .feature-grid { grid-template-columns: 1fr; gap: 16px !important; }
        }
      `}</style>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(123,57,252,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div className="section-hidden" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 20,
            background: 'rgba(123,57,252,0.15)', border: '1px solid rgba(123,57,252,0.3)',
            fontFamily: 'Cabin', fontSize: 13, fontWeight: 500, color: '#c4b5fd',
          }}>
            ✦ Features
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif", color: 'white',
            fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.15,
            marginBottom: 16, margin: '0 auto 16px',
          }}>
            Everything you need for<br />
            <em style={{ fontStyle: 'italic', color: '#a855f7' }}>LTspice components</em>
          </h2>
          <p style={{
            fontFamily: 'Inter', color: 'rgba(255,255,255,0.6)', fontSize: 17,
            maxWidth: 480, margin: '16px auto 0', lineHeight: 1.7,
          }}>
            A complete toolkit for managing, installing, and creating LTspice simulation components.
          </p>
        </div>

        {/* Grid */}
        <div className="feature-grid" style={{
          display: 'grid',
          gap: 20,
          alignItems: 'stretch',
        }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className="section-hidden glass-card"
              style={{
                borderRadius: 16, padding: 28,
                transitionDelay: `${i * 80}ms`,
                display: 'flex', flexDirection: 'column',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${f.color}22`, color: f.color,
                border: `1px solid ${f.color}33`, marginBottom: 20, flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 17,
                color: 'white', marginBottom: 10,
              }}>{f.title}</h3>
              <p style={{
                fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7, margin: 0, flexGrow: 1,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
