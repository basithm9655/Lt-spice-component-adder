const steps = [
  {
    num: '01',
    title: 'Download & Launch',
    desc: 'Download the free Windows EXE. No installation needed — just double-click and run.',
    color: '#7b39fc',
    tag: 'Free & Portable',
  },
  {
    num: '02',
    title: 'Auto-detect LTspice',
    desc: 'The app finds your LTspice folder automatically. Browse manually if it\'s in a custom location.',
    color: '#06b6d4',
    tag: 'Smart Detection',
  },
  {
    num: '03',
    title: 'Pick Components',
    desc: 'Browse categories — Flipflops, OPAMPs, 74LS series. Check the ones you need.',
    color: '#f59e0b',
    tag: 'Visual Browser',
  },
  {
    num: '04',
    title: 'Click Install',
    desc: 'Hit "Install Selected →". Files are routed correctly to lib/sym and lib/sub automatically.',
    color: '#10b981',
    tag: 'One Click',
  },
  {
    num: '05',
    title: 'Add Any Custom Component',
    desc: 'Ask ChatGPT, Gemini, or Claude for .asy & .lib/.sub code. Paste or upload the files — app auto-installs them to LTspice immediately.',
    color: '#a484d7',
    tag: 'Paste or Upload',
  },
  {
    num: '06',
    title: 'Restart LTspice',
    desc: 'Open LTspice — your new components appear in the component library, ready to use in schematics.',
    color: '#f43f5e',
    tag: 'Done!',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad" style={{ position: 'relative' }}>
      <style>{`
        .section-pad { padding: 112px 0; }
        .hiw-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
        @media (max-width: 768px) {
          .section-pad { padding: 64px 0; }
          .hiw-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
      <div style={{
        position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)',
        width: 400, height: 400, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(123,57,252,0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
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
            ✦ How It Works
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif", color: 'white',
            fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.15,
            marginBottom: 16, margin: '0 auto 16px',
          }}>
            Up and running in{' '}
            <em style={{ fontStyle: 'italic', color: '#a855f7' }}>60 seconds</em>
          </h2>
          <p style={{
            fontFamily: 'Inter', color: 'rgba(255,255,255,0.6)', fontSize: 17,
            maxWidth: 480, margin: '16px auto 0', lineHeight: 1.7,
          }}>
            From download to first simulation — faster than you think.
          </p>
        </div>

        {/* Grid */}
        <div className="hiw-grid" style={{
          display: 'grid',
          gap: 20,
        }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="section-hidden glass-card relative"
              style={{
                borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column',
                transitionDelay: `${i * 70}ms`,
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Number */}
              <div style={{
                fontFamily: 'Manrope', fontWeight: 800, fontSize: 48, lineHeight: 1,
                color: `${step.color}25`, marginBottom: 16, userSelect: 'none'
              }}>
                {step.num}
              </div>
              
              {/* Tag */}
              <div style={{ marginBottom: 12 }}>
                <span style={{
                  display: 'inline-block', padding: '4px 10px', borderRadius: 999,
                  fontFamily: 'Cabin', fontWeight: 600, fontSize: 11,
                  background: `${step.color}18`, color: step.color
                }}>
                  {step.tag}
                </span>
              </div>
              
              <h3 style={{
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 17,
                color: 'white', marginBottom: 10,
              }}>{step.title}</h3>
              
              <p style={{
                fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7, margin: 0, flexGrow: 1,
              }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
