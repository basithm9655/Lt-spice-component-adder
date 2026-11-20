import { useState, useMemo } from 'react'
import { CheckCircle2, Search, X, Cpu, Layers } from 'lucide-react'

export const ALL_COMPONENTS = [
  // ── 1. Diodes (16) ─────────────────────────────────────────────────────────
  { name: '1N34A', category: 'Diodes', catColor: '#38bdf8', type: 'Germanium Point-Contact', desc: 'Syllabus Germanium standard. Point-contact detector diode with authentic Vf ≈ 0.25V @ 1mA, Is=2.6µA, Eg=0.67eV.' },
  { name: '1N270', category: 'Diodes', catColor: '#38bdf8', type: 'Germanium Gold-Bonded', desc: 'High conductance Germanium diode. Heavy forward current with Vf ≈ 0.29V @ 1mA, 1.0V @ 200mA, Bv=100V.' },
  { name: 'OA91', category: 'Diodes', catColor: '#38bdf8', type: 'Germanium Gold-Bonded', desc: 'Mullard detector diode. Authentic Germanium knee Vf ≈ 0.28V @ 2mA, Bv=115V, Tt=5ns for RF demodulation.' },
  { name: '1N60', category: 'Diodes', catColor: '#38bdf8', type: 'Germanium Radio Detector', desc: 'Point-contact AM detector & audio clipper diode. Vf ≈ 0.24V @ 100µA, low capacitance Cjo=1.0pF, Bv=45V.' },
  { name: 'OA79', category: 'Diodes', catColor: '#38bdf8', type: 'Germanium Point-Contact', desc: 'Mullard high-speed Germanium diode. Point-contact junction with Vf ≈ 0.29V @ 1mA, Bv=45V.' },
  { name: '1N3716', category: 'Diodes', catColor: '#38bdf8', type: 'Tunnel Diode (NDR)', desc: 'Germanium tunnel diode with true Negative Differential Resistance (NDR). Peak Ip=1.0mA @ 65mV, valley Iv=0.14mA @ 337mV.' },
  { name: 'BZX55C3V3', category: 'Diodes', catColor: '#38bdf8', type: 'Zener Diode (3.3V)', desc: 'Low-voltage Zener regulator. Vz=3.3V @ 5mA, dynamic resistance Rz=55Ω, negative tempco Tbv1=-0.48m/K.' },
  { name: 'BZX55C5V1', category: 'Diodes', catColor: '#38bdf8', type: 'Zener Diode (5.1V)', desc: 'Zero-tempco laboratory reference Zener diode. Vz=5.1V @ 5mA, Rz=10Ω, 500mW power dissipation.' },
  { name: 'BZX55C6V2', category: 'Diodes', catColor: '#38bdf8', type: 'Zener Diode (6.2V)', desc: 'Zener/Avalanche transition voltage regulator. Vz=6.2V @ 5mA, sharp knee Rz=6Ω, positive tempco Tbv1=+0.32m/K.' },
  { name: 'BZX55C9V1', category: 'Diodes', catColor: '#38bdf8', type: 'Zener Diode (9.1V)', desc: 'Avalanche breakdown voltage regulator. Vz=9.1V @ 5mA, Rz=8Ω, positive tempco Tbv1=+0.49m/K.' },
  { name: 'IDEAL_DIODE', category: 'Diodes', catColor: '#38bdf8', type: 'Ideal Diode Model', desc: 'Textbook analysis ideal diode. Zero threshold Vf=0.0V, Ron=1mΩ, Roff=100MΩ for classroom circuit theory.' },
  { name: 'LED_RED', category: 'Diodes', catColor: '#38bdf8', type: 'Red LED', desc: 'Standard Red GaAsP LED. Vf=1.85V @ 20mA, Eg=1.9eV, Dominant emission wavelength 635nm.' },
  { name: 'LED_GREEN', category: 'Diodes', catColor: '#38bdf8', type: 'Green LED', desc: 'Standard Green GaP LED. Vf=2.12V @ 20mA, Eg=2.2eV, Dominant emission wavelength 565nm.' },
  { name: 'LED_BLUE', category: 'Diodes', catColor: '#38bdf8', type: 'Blue LED', desc: 'High-brightness Blue InGaN LED. Vf=3.12V @ 20mA, Eg=3.2eV, Dominant emission wavelength 470nm.' },
  { name: 'BB105', category: 'Diodes', catColor: '#38bdf8', type: 'Varactor / Varicap', desc: 'VHF/UHF electronic tuning varactor diode. Zero-bias capacitance Cjo=18pF, Bv=30V, grading coefficient M=1.05.' },
  { name: 'BAR64', category: 'Diodes', catColor: '#38bdf8', type: 'PIN Diode', desc: 'Silicon RF switching and variable attenuation PIN diode. Ultra-low capacitance Cjo=0.23pF, Rs=0.85Ω, Tt=1.5µs.' },

  // ── 2. BJT Transistors (12) ────────────────────────────────────────────────
  { name: 'SL100', category: 'BJT', catColor: '#10b981', type: 'NPN Medium Power', desc: 'University lab standard NPN transistor. Vceo=50V, Ic=500mA, hFE=150, true datasheet fT=100MHz (Tf=1.6ns).' },
  { name: 'SK100', category: 'BJT', catColor: '#10b981', type: 'PNP Medium Power', desc: 'University lab standard PNP transistor. Complementary to SL100, Vceo=-50V, Ic=-500mA, hFE=150, fT=100MHz.' },
  { name: 'BC547', category: 'BJT', catColor: '#10b981', type: 'NPN Small Signal', desc: 'Universal audio and small-signal amplifier BJT. Vceo=45V, Ic=100mA, hFE=300, fT=350MHz, noise figure NF=2dB.' },
  { name: 'BC548', category: 'BJT', catColor: '#10b981', type: 'NPN Small Signal', desc: 'General purpose small-signal audio transistor. Vceo=30V, Ic=100mA, hFE=250, fT=350MHz.' },
  { name: 'BC557', category: 'BJT', catColor: '#10b981', type: 'PNP Small Signal', desc: 'Complementary PNP to BC547. Low noise audio preamplifier, Vceo=-45V, Ic=-100mA, hFE=300, fT=300MHz.' },
  { name: 'BC558', category: 'BJT', catColor: '#10b981', type: 'PNP Small Signal', desc: 'Complementary PNP to BC548. General purpose audio switching and amplification, Vceo=-30V, Ic=-100mA, hFE=250.' },
  { name: 'BD139', category: 'BJT', catColor: '#10b981', type: 'NPN Audio Driver', desc: 'Class B and Class AB push-pull complementary driver. Vceo=80V, Ic=1.5A, Ptot=12.5W, hFE=160, fT=160MHz.' },
  { name: 'BD140', category: 'BJT', catColor: '#10b981', type: 'PNP Audio Driver', desc: 'Class B and Class AB push-pull complementary driver to BD139. Vceo=-80V, Ic=-1.5A, Ptot=12.5W, hFE=160, fT=160MHz.' },
  { name: 'TIP31C', category: 'BJT', catColor: '#10b981', type: 'NPN Power BJT', desc: 'Audio power amplifier output stage. Vceo=100V, Ic=3A (5A peak), Ptot=40W, hFE=80, true fT=3.0MHz (Tf=53ns).' },
  { name: 'TIP32C', category: 'BJT', catColor: '#10b981', type: 'PNP Power BJT', desc: 'Complementary PNP to TIP31C for push-pull power amplifiers. Vceo=-100V, Ic=-3A, Ptot=40W, hFE=80, true fT=3.0MHz.' },
  { name: '2N3055', category: 'BJT', catColor: '#10b981', type: 'NPN Power BJT (TO-3)', desc: 'Legendary 15A 60V 115W NPN power transistor in TO-3 steel case. Modeled with true fT=2.5MHz (Tf=64ns) and Tr=500ns.' },
  { name: 'MJ2955', category: 'BJT', catColor: '#10b981', type: 'PNP Power BJT (TO-3)', desc: 'Complementary PNP power transistor to 2N3055 in TO-3 case. Vceo=-60V, Ic=-15A, Ptot=115W, true fT=2.5MHz (Tf=64ns).' },

  // ── 3. JFET (5) ────────────────────────────────────────────────────────────
  { name: 'BFW10', category: 'JFET', catColor: '#a855f7', type: 'N-Channel JFET', desc: 'Syllabus lab standard N-channel JFET. Pinch-off Vp=-2.3V, Beta=2.03m, Idss=10.7mA, transconductance gm=4.7mS.' },
  { name: 'BFW11', category: 'JFET', catColor: '#a855f7', type: 'N-Channel JFET', desc: 'General purpose N-channel JFET. Vp=-2.1V, Idss=7.0mA, gm=3.4mS, Cgs=2.3pF for high input impedance amplifiers.' },
  { name: '2N3819', category: 'JFET', catColor: '#a855f7', type: 'N-Channel JFET', desc: 'Boylestad/Floyd textbook standard N-channel JFET. Vp=-3.0V, Idss=11.7mA, Cgs=2.5pF for RF and audio buffering.' },
  { name: '2N5457', category: 'JFET', catColor: '#a855f7', type: 'N-Channel JFET', desc: 'Low noise audio and analog switching JFET. Vp=-2.0V, Idss=3.6mA, Cgs=3.0pF for high input impedance preamplifiers.' },
  { name: '2N5460', category: 'JFET', catColor: '#a855f7', type: 'P-Channel JFET', desc: 'Authentic depletion P-JFET. Negative Vto=-2.5V (pinch-off Vgs=+2.5V), Idss=-4.5mA for complementary JFET circuits.' },

  // ── 4. MOSFET (5) ──────────────────────────────────────────────────────────
  { name: '2N7000', category: 'MOSFET', catColor: '#ec4899', type: 'N-Channel VDMOS', desc: 'Enhancement-mode small-signal MOSFET. Threshold Vth=2.1V, Rds(on)=2.5Ω, continuous Id=200mA (pulsed 500mA).' },
  { name: 'BS170', category: 'MOSFET', catColor: '#ec4899', type: 'N-Channel VDMOS', desc: 'Low on-resistance N-channel enhancement MOSFET. Vth=2.0V, Rds(on)=1.8Ω @ Vgs=10V, continuous Id=500mA.' },
  { name: 'IRF540N', category: 'MOSFET', catColor: '#ec4899', type: 'N-Channel Power VDMOS', desc: '100V 33A 130W Power MOSFET. Ultra-low on-resistance Rds(on)=44mΩ, input capacitance Cgs=1.5nF.' },
  { name: 'IRF9540N', category: 'MOSFET', catColor: '#ec4899', type: 'P-Channel Power VDMOS', desc: '-100V -23A 140W Complementary Power MOSFET to IRF540N. Rds(on)=92mΩ for high-power H-bridges and DC-DC converters.' },
  { name: '3N163', category: 'MOSFET', catColor: '#ec4899', type: 'Depletion MOSFET', desc: 'P-channel depletion MOSFET modeled as 3-pin VDMOS. Vto=-2.5V, Idss=12.5mA, Rds(on)≈7Ω for syllabus FET analysis.' },

  // ── 5. UJT & Thyristors (6) ────────────────────────────────────────────────
  { name: '2N2646', category: 'UJT_Thyristors', catColor: '#f43f5e', type: 'Unijunction Transistor', desc: 'Syllabus relaxation oscillator standard. Base resistance Rbb=6.09kΩ, intrinsic standoff ratio η=0.587, peak Ip=2µA.' },
  { name: '2N2647', category: 'UJT_Thyristors', catColor: '#f43f5e', type: 'Precision UJT', desc: 'High-precision pulse and timing UJT. Base resistance Rbb=6.80kΩ, exact datasheet intrinsic standoff ratio η=0.70.' },
  { name: '2N5060', category: 'UJT_Thyristors', catColor: '#f43f5e', type: 'Sensitive Gate SCR', desc: '100V 0.8A Silicon Controlled Rectifier. Regenerative two-transistor latching, gate trigger Igt=65µA, holding Ih=1.0mA.' },
  { name: '2N6027', category: 'UJT_Thyristors', catColor: '#f43f5e', type: 'Programmable UJT (PUT)', desc: 'True N-gate Programmable Unijunction Transistor. Triggers cleanly when Anode voltage Va > Gate Vg + 0.65V, Vak=40V.' },
  { name: 'BT136', category: 'UJT_Thyristors', catColor: '#f43f5e', type: 'TRIAC (600V, 4A)', desc: '4-quadrant AC power control TRIAC. Authentic triggering in Quadrants I–IV, Vdrm=600V, It(RMS)=4A, Igt=10mA, Ih=15mA.' },
  { name: 'DB3', category: 'UJT_Thyristors', catColor: '#f43f5e', type: 'Bidirectional DIAC', desc: 'Bidirectional trigger DIAC. Symmetrical breakdown Vbo=±32V, breakback voltage snapback ΔV≈14V, leakage <0.3µA.' },

  // ── 6. Amplifiers (3) ──────────────────────────────────────────────────────
  { name: 'LM386', category: 'Amplifiers', catColor: '#06b6d4', type: 'Audio Power Amplifier IC', desc: 'Class-AB low-voltage audio power amplifier. Supply Vs=4–12V, internal gain 20 (pins 1–8 open) to 200 (bypassed), Pout=1W.' },
  { name: 'TDA2030', category: 'Amplifiers', catColor: '#06b6d4', type: '14W Hi-Fi Audio Amp', desc: '14W Class-AB Hi-Fi audio power amplifier. Avol=80dB, GBW=10MHz, SR=8V/µs, output current limit 3.5A, rail dropout 1.8V.' },
  { name: 'MAT02', category: 'Amplifiers', catColor: '#06b6d4', type: 'Matched Differential Pair', desc: 'Ultra-low noise matched BJT pair. Vceo=40V, offset ΔVbe < 50µV, hFE matching 2%, CMRR > 120dB for precision diff-amps.' },

  // ── 7. OPAMP & Regulators (7) ──────────────────────────────────────────────
  { name: 'LM741', category: 'OPAMP', catColor: '#3b82f6', type: 'General Purpose Op-Amp', desc: 'Classic 20-transistor discrete BJT op-amp netlist. Open loop gain Avol=106dB, GBW=1MHz, slew rate 0.5V/µs, Rout=75Ω.' },
  { name: 'LM358', category: 'OPAMP', catColor: '#3b82f6', type: 'Dual Single-Supply Op-Amp', desc: 'True ground-sensing single-supply op-amp. Input common-mode includes ground (VN), output swings down to VN+20mV, Avol=100dB.' },
  { name: 'TL082', category: 'OPAMP', catColor: '#3b82f6', type: 'Dual JFET Op-Amp', desc: 'High-speed JFET-input op-amp. Input impedance Rin=1TΩ, input bias Ibias=30pA, fast slew rate 13V/µs, GBW=3MHz.' },
  { name: 'LM317', category: 'OPAMP', catColor: '#3b82f6', type: 'Adjustable Regulator', desc: '1.25V to 37V 1.5A positive linear voltage regulator. Internal reference Vref=1.25V, 80dB ripple rejection.' },
  { name: 'LM7905', category: 'OPAMP', catColor: '#3b82f6', type: 'Negative Regulator (-5V)', desc: '-5.0V 1.5A fixed negative voltage regulator. Input range -7V to -25V, Pin 2 configured as COM (Ground).' },
  { name: 'LM7912', category: 'OPAMP', catColor: '#3b82f6', type: 'Negative Regulator (-12V)', desc: '-12.0V 1.5A fixed negative voltage regulator. Input range -14.5V to -30V, Pin 2 configured as COM (Ground).' },
  { name: 'LM7915', category: 'OPAMP', catColor: '#3b82f6', type: 'Negative Regulator (-15V)', desc: '-15.0V 1.5A fixed negative voltage regulator. Input range -17.5V to -30V, Pin 2 configured as COM (Ground).' },

  // ── 8. 74LS Digital Series (3) ─────────────────────────────────────────────
  { name: '74LS90', category: '74LSx_Series', catColor: '#f59e0b', type: 'Decade Counter', desc: 'Asynchronous BCD counter. Independent Divide-by-2 (CKA) and Divide-by-5 (CKB) sections, combined for BCD 0–9 count.' },
  { name: '74LS93', category: '74LSx_Series', catColor: '#f59e0b', type: '4-Bit Binary Counter', desc: '4-bit binary ripple counter. Divide-by-2 (CKA) and Divide-by-8 (CKB) sections, combined for 4-bit 0–15 binary count.' },
  { name: '74LS95', category: '74LSx_Series', catColor: '#f59e0b', type: '4-Bit Shift Register', desc: 'Parallel-access shift register. Supports Serial Shift Right and Parallel Load with independent Mode Control.' },

  // ── 9. Flip-Flops (2) ──────────────────────────────────────────────────────
  { name: 'DFlipFlop', category: 'Flipflop', catColor: '#6366f1', type: 'D Flip-Flop', desc: 'Native LTspice DFLOP digital device with 50Ω buffered output drivers. Rising-edge triggered with Q and Qbar outputs.' },
  { name: 'JK', category: 'Flipflop', catColor: '#6366f1', type: 'JK Flip-Flop', desc: 'Native LTspice DFLOP JK architecture. Supports Hold (00), Reset (01), Set (10), and Toggle (11) modes with Preset/Clear.' },
]

export const CATEGORIES = [
  { id: 'all', name: 'All Models', count: 59, color: '#a855f7' },
  { id: 'Diodes', name: 'Diodes', count: 16, color: '#38bdf8' },
  { id: 'BJT', name: 'BJT Transistors', count: 12, color: '#10b981' },
  { id: 'OPAMP', name: 'OPAMP & Regulators', count: 7, color: '#3b82f6' },
  { id: 'UJT_Thyristors', name: 'UJT & Thyristors', count: 6, color: '#f43f5e' },
  { id: 'JFET', name: 'JFET', count: 5, color: '#a855f7' },
  { id: 'MOSFET', name: 'MOSFET', count: 5, color: '#ec4899' },
  { id: 'Amplifiers', name: 'Amplifiers', count: 3, color: '#06b6d4' },
  { id: '74LSx_Series', name: '74LS Digital', count: 3, color: '#f59e0b' },
  { id: 'Flipflop', name: 'Flip-Flops', count: 2, color: '#6366f1' },
]

export default function Components() {
  const [activeCat, setActiveCat] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return ALL_COMPONENTS.filter(comp => {
      const matchCat = activeCat === 'all' || comp.category === activeCat
      if (!matchCat) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        comp.name.toLowerCase().includes(q) ||
        comp.type.toLowerCase().includes(q) ||
        comp.desc.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q)
      )
    })
  }, [activeCat, search])

  return (
    <section id="components" className="section-pad" style={{ position: 'relative' }}>
      <style>{`
        .section-pad { padding: 112px 0; }
        .comp-filters { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 32px; }
        .comp-grid-all { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
        .comp-card {
          border-radius: 14px;
          padding: 20px;
          background: rgba(43,35,68,0.45);
          border: 1px solid rgba(123,57,252,0.15);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .comp-card:hover {
          transform: translateY(-3px);
          border-color: rgba(123,57,252,0.4);
          box-shadow: 0 8px 24px rgba(123,57,252,0.18);
        }
        @media (max-width: 768px) {
          .section-pad { padding: 64px 0; }
          .comp-grid-all { grid-template-columns: 1fr !important; gap: 12px !important; }
          .comp-filters { justify-content: flex-start; overflow-x: auto; padding-bottom: 8px; flex-wrap: nowrap; margin: 0 -24px 24px; padding: 0 24px 8px; }
          .comp-filters > button { flex-shrink: 0; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div className="section-hidden" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 20,
            background: 'rgba(123,57,252,0.15)', border: '1px solid rgba(123,57,252,0.3)',
            fontFamily: 'Cabin', fontSize: 13, fontWeight: 500, color: '#c4b5fd',
          }}>
            ✦ 59 Physical SPICE Semiconductor Models
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif", color: 'white',
            fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.15,
            marginBottom: 16, margin: '0 auto 16px',
          }}>
            Complete Built-in Component Library<br/>
            <em style={{ fontStyle: 'italic', color: '#a855f7' }}>100% Physics &amp; Syllabus Verified</em>
          </h2>
          <p style={{
            fontFamily: 'Inter', color: 'rgba(255,255,255,0.65)', fontSize: 16,
            maxWidth: 680, margin: '0 auto 32px', lineHeight: 1.6,
          }}>
            All 59 components are modeled strictly from Boylestad, Malvino, and Floyd textbook equations.
            Each part includes complete symbols (<code style={{ color: '#38bdf8' }}>.asy</code>), netlists (<code style={{ color: '#38bdf8' }}>.lib</code>/<code style={{ color: '#38bdf8' }}>.sub</code>), and LTspice native database records.
          </p>

          {/* Search Bar */}
          <div style={{
            position: 'relative', maxWidth: 540, margin: '0 auto',
            display: 'flex', alignItems: 'center'
          }}>
            <Search size={18} style={{
              position: 'absolute', left: 16, color: 'rgba(255,255,255,0.4)', pointerEvents: 'none'
            }} />
            <input
              type="text"
              placeholder="Search 59 components... (e.g. Germanium, BFW10, SL100, Zener, LM386)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '14px 44px 14px 44px',
                borderRadius: 12,
                background: 'rgba(30,24,50,0.8)',
                border: '1px solid rgba(123,57,252,0.3)',
                color: 'white', fontFamily: 'Inter', fontSize: 14,
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#7b39fc'}
              onBlur={e => e.target.style.borderColor = 'rgba(123,57,252,0.3)'}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute', right: 14, background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="comp-filters">
          {CATEGORIES.map(cat => {
            const isSelected = activeCat === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 999,
                  border: isSelected ? `1px solid ${cat.color}` : '1px solid rgba(255,255,255,0.08)',
                  background: isSelected ? `${cat.color}25` : 'rgba(43,35,68,0.4)',
                  color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.65)',
                  fontFamily: 'Cabin', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 0 12px ${cat.color}30` : 'none'
                }}
              >
                <span>{cat.name}</span>
                <span style={{
                  padding: '2px 7px', borderRadius: 999, fontSize: 11,
                  background: isSelected ? cat.color : 'rgba(255,255,255,0.1)',
                  color: isSelected ? '#000000' : 'rgba(255,255,255,0.6)',
                  fontWeight: 700
                }}>
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Status Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20, padding: '0 8px', fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.45)'
        }}>
          <div>
            Showing <strong style={{ color: 'white' }}>{filtered.length}</strong> of <strong>59</strong> verified components
            {search && <span> matching "<span style={{ color: '#c084fc' }}>{search}</span>"</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={14} color="#10b981" />
            <span style={{ color: '#10b981', fontWeight: 500 }}>All Models Pass LTspice Convergence</span>
          </div>
        </div>

        {/* Component Cards Grid */}
        <div className="comp-grid-all">
          {filtered.map(comp => (
            <div key={comp.name} className="comp-card">
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                marginBottom: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Cpu size={18} style={{ color: comp.catColor }} />
                  <span style={{
                    fontFamily: 'Consolas, Monaco, monospace', fontWeight: 700,
                    fontSize: 17, color: 'white'
                  }}>
                    {comp.name}
                  </span>
                </div>
                <span style={{
                  display: 'inline-block', padding: '3px 9px', borderRadius: 999,
                  fontFamily: 'Cabin', fontWeight: 600, fontSize: 11,
                  background: `${comp.catColor}18`, color: comp.catColor,
                  border: `1px solid ${comp.catColor}40`
                }}>
                  {comp.type}
                </span>
              </div>

              <p style={{
                fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.5, margin: '0 0 16px 0', flexGrow: 1
              }}>
                {comp.desc}
              </p>

              <div style={{
                paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: 11, fontFamily: 'Cabin'
              }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Category: <strong style={{ color: comp.catColor }}>{comp.category}</strong>
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  color: '#10b981', fontWeight: 600
                }}>
                  <CheckCircle2 size={13} /> Verified SPICE
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px', borderRadius: 16,
            background: 'rgba(43,35,68,0.3)', border: '1px solid rgba(123,57,252,0.1)'
          }}>
            <p style={{ fontFamily: 'Inter', fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
              No components found matching "{search}"
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCat('all'); }}
              style={{
                padding: '8px 18px', borderRadius: 8, background: '#7b39fc', color: 'white',
                border: 'none', cursor: 'pointer', fontFamily: 'Cabin', fontWeight: 600, fontSize: 13
              }}
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}

        {/* Bottom Banner */}
        <div style={{
          marginTop: 48, padding: '24px 32px', borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(123,57,252,0.15) 0%, rgba(6,182,212,0.1) 100%)',
          border: '1px solid rgba(123,57,252,0.25)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20
        }}>
          <div>
            <h4 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 17, color: 'white', margin: '0 0 4px 0' }}>
              Install All 59 Components in One Click
            </h4>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Auto-syncs into LTspice symbols (<code style={{ color: '#67e8f9' }}>lib/sym/</code>), subcircuits (<code style={{ color: '#67e8f9' }}>lib/sub/</code>), and right-click picker databases (<code style={{ color: '#67e8f9' }}>standard.cmp</code>).
            </p>
          </div>
          <a
            href="/ltspice-component-adder.zip"
            download
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10,
              background: '#10b981', color: 'white', textDecoration: 'none',
              fontFamily: 'Cabin', fontWeight: 700, fontSize: 14,
              boxShadow: '0 4px 18px rgba(16,185,129,0.35)',
              transition: 'transform 0.2s, opacity 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Download Free (.zip)
          </a>
        </div>

      </div>
    </section>
  )
}
