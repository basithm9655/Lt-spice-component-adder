import { useState } from 'react'
import { CheckCircle, ExternalLink } from 'lucide-react'

const categories = [
  {
    name: 'Diodes',
    color: '#38bdf8',
    icon: '⟁',
    components: [
      { name: '1N34A', desc: 'Germanium point-contact diode (Vf ~0.25V)' },
      { name: 'OA91', desc: 'Gold-bonded Germanium detector diode' },
      { name: '1N270', desc: 'Germanium gold-bonded low-leakage diode' },
      { name: '1N60', desc: 'Germanium radio detector & clipper diode' },
      { name: 'IDEAL_DIODE', desc: 'Ideal diode model for textbook theory analysis' },
      { name: 'BZX55C5V1', desc: '5.1V Zener diode for voltage regulation' },
      { name: '1N3716', desc: 'Tunnel diode with negative resistance (NDR)' },
      { name: 'BB105', desc: 'Varactor / varicap tuning diode' },
      { name: 'BAR64', desc: 'PIN diode for RF attenuation & switching' },
      { name: 'LED (RGBY)', desc: 'Calibrated Red, Green, Blue, Yellow LEDs' },
    ],
  },
  {
    name: 'BJT Transistors',
    color: '#10b981',
    icon: '⎇',
    components: [
      { name: 'SL100', desc: 'Standard lab NPN medium-power transistor' },
      { name: 'SK100', desc: 'Complementary lab PNP medium-power transistor' },
      { name: 'BC547 / BC548', desc: 'Universal audio & small-signal NPN' },
      { name: 'BC557 / BC558', desc: 'Universal audio & small-signal PNP' },
      { name: 'BD139 / BD140', desc: 'Complementary pair for Class B/AB push-pull' },
      { name: 'TIP31C / TIP32C', desc: 'Complementary audio power amplifier BJTs' },
      { name: '2N3055 / MJ2955', desc: 'High-power output transistors (TO-3)' },
    ],
  },
  {
    name: 'FET & MOSFET',
    color: '#a855f7',
    icon: '⧉',
    components: [
      { name: 'BFW10', desc: 'Classic syllabus N-channel JFET (Vp ~ -2.3V)' },
      { name: 'BFW11', desc: 'N-channel JFET for amplifier experiments' },
      { name: '2N3819', desc: 'General-purpose N-channel JFET' },
      { name: '2N5460', desc: 'P-channel JFET for complementary circuits' },
      { name: '2N7000 / BS170', desc: 'N-channel enhancement MOSFETs' },
      { name: 'IRF540N / IRF9540N', desc: 'Power MOSFET complementary pair' },
      { name: '3N163', desc: 'Depletion-mode MOSFET for syllabus study' },
    ],
  },
  {
    name: 'UJT & Oscillators',
    color: '#ec4899',
    icon: '⚡',
    components: [
      { name: '2N2646', desc: 'Unijunction transistor (UJT) relaxation oscillator' },
      { name: '2N2647', desc: 'Precision pulse & timing UJT' },
      { name: '2N6027', desc: 'Programmable unijunction transistor (PUT)' },
      { name: 'BT136', desc: '600V 4A TRIAC for AC phase control' },
      { name: '2N5060', desc: 'Sensitive gate SCR for latching & triggering' },
      { name: 'DB3', desc: 'Bidirectional trigger DIAC (Vbo ~ 32V)' },
    ],
  },
  {
    name: 'Amplifiers & OPAMP',
    color: '#06b6d4',
    icon: '◁▷',
    components: [
      { name: 'LM386', desc: 'Low-voltage audio power amplifier IC' },
      { name: 'TDA2030', desc: '14W Hi-Fi Class AB audio amplifier' },
      { name: 'MAT02', desc: 'Ultra-low noise matched differential BJT pair' },
      { name: 'LM741', desc: 'Classic general-purpose op-amp' },
      { name: 'TL082', desc: 'Dual high-speed JFET input op-amp' },
      { name: 'LM317', desc: '1.5A adjustable positive voltage regulator' },
      { name: 'LM7905/12/15', desc: 'Negative voltage regulators (-5V, -12V, -15V)' },
    ],
  },
  {
    name: 'Digital & Counters',
    color: '#f59e0b',
    icon: '▦',
    components: [
      { name: '74LS90', desc: 'Decade counter / divide-by-10 & divide-by-12' },
      { name: '74LS93', desc: '4-bit binary counter' },
      { name: '74LS95', desc: '4-bit parallel access shift register' },
      { name: 'DFlipFlop', desc: 'D-type flip-flop with clock, set, reset' },
      { name: 'JK Flip-Flop', desc: 'JK flip-flop for sequential logic circuits' },
    ],
  },
]

export default function Components() {
  const [active, setActive] = useState(0)

  return (
    <section id="components" className="section-pad" style={{ position: 'relative' }}>
      <style>{`
        .section-pad { padding: 112px 0; }
        .tabs-container { display: flex; flex-direction: column; gap: 12px; }
        .comp-inner-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
        @media (max-width: 768px) {
          .section-pad { padding: 64px 0; }
          .tabs-container { flex-direction: row; overflow-x: auto; padding-bottom: 8px; margin: 0 -24px; padding: 0 24px 8px; scroll-snap-type: x mandatory; }
          .tabs-container > button { min-width: 240px; flex-shrink: 0; scroll-snap-align: center; }
          .comp-inner-grid { grid-template-columns: 1fr !important; }
          .glass-card { padding: 20px !important; }
        }
        @media (min-width: 992px) {
          .components-grid { grid-template-columns: 300px 1fr !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div className="section-hidden" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 20,
            background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)',
            fontFamily: 'Cabin', fontSize: 13, fontWeight: 500, color: '#67e8f9',
          }}>
            ✦ Built-in Components
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif", color: 'white',
            fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.15,
            marginBottom: 16, margin: '0 auto 16px',
          }}>
            Ready-to-use components,<br/>
            <em style={{ fontStyle: 'italic', color: '#22d3ee' }}>right out of the box</em>
          </h2>
          <p style={{
            fontFamily: 'Inter', color: 'rgba(255,255,255,0.6)', fontSize: 17,
            maxWidth: 540, margin: '16px auto 8px', lineHeight: 1.7,
          }}>
            Curated semiconductor and IC models covering syllabus and laboratory standards. Browse by category and install with one click.
          </p>
        </div>

        {/* Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 24,
        }}>
          
          <div className="components-grid" style={{ display: 'grid', gap: 24 }}>
            {/* Category tabs */}
            <div className="tabs-container">
              {categories.map((cat, i) => (
                <button
                  key={cat.name}
                  onClick={() => setActive(i)}
                  className="section-hidden"
                  style={{
                    textAlign: 'left', padding: '20px 24px', borderRadius: 16,
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: active === i ? `${cat.color}20` : 'rgba(43,35,68,0.4)',
                    border: active === i ? `1px solid ${cat.color}60` : '1px solid rgba(123,57,252,0.1)',
                    boxShadow: active === i ? `0 0 20px ${cat.color}20` : 'none',
                    display: 'flex', alignItems: 'center', gap: 16, width: '100%'
                  }}
                >
                  <span style={{ fontSize: 24, color: active === i ? cat.color : 'rgba(255,255,255,0.5)' }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: 'white', marginBottom: 4 }}>
                      {cat.name}
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                      {cat.components.length} components
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Component list */}
            <div className="section-hidden glass-card" style={{
              borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column',
              background: 'rgba(43,35,68,0.5)', border: '1px solid rgba(123,57,252,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <span style={{ fontSize: 32, color: categories[active].color }}>{categories[active].icon}</span>
                <div>
                  <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, color: 'white', margin: '0 0 4px 0' }}>
                    {categories[active].name}
                  </h3>
                  <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                    {categories[active].components.length} components available
                  </p>
                </div>
              </div>
              
              <div className="comp-inner-grid" style={{
                display: 'grid', gap: 16
              }}>
                {categories[active].components.map((comp) => (
                  <div key={comp.name} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: 16, borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <CheckCircle size={18} style={{ color: categories[active].color, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'white', marginBottom: 4 }}>
                        {comp.name}
                      </div>
                      <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
                        {comp.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{
                marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16
              }}>
                <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                  All models bundled — no internet needed
                </span>
                <span style={{
                  padding: '4px 12px', borderRadius: 999, fontFamily: 'Cabin', fontSize: 12, fontWeight: 500,
                  background: `${categories[active].color}20`, color: categories[active].color
                }}>
                  Offline Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
