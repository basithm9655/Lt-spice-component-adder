# ⚡ LTspice Component Adder Pro

An advanced, high-performance desktop tool for Windows to manage, inspect, and install custom semiconductor and integrated circuit SPICE models into LTspice in one click.

---

## 🎯 Syllabus & Textbook Complete Alignment
Designed specifically to fulfill the standard electronic devices and circuits laboratory syllabus (Boylestad, Malvino, Floyd, Bell, Millman-Halkias, Neamen), providing the critical components that are notoriously missing or uncharacterized in stock LTspice.

### 📚 Included Models & Categories (59 Components)

| Category | Components Included | Highlights & Academic Focus |
|:---|:---|:---|
| **Diodes** | `1N34A`, `OA79`, `OA91`, `1N270`, `1N60`, `IDEAL_DIODE`, `1N3716`, `BB105`, `BAR64`, `BZX55C3V3`, `BZX55C5V1`, `BZX55C6V2`, `BZX55C9V1`, `LED_RED`, `LED_GREEN`, `LED_BLUE` | **Germanium point-contact diodes** ($V_f \approx 0.25\text{V}$, $E_g = 0.67\text{eV}$), Ideal theoretical diode, Tunnel diode with negative differential resistance (NDR), Varactor tuning diode, PIN diode, and Zener regulators. |
| **BJT** | `SL100`, `SK100`, `BC547`, `BC548`, `BC557`, `BC558`, `BD139`, `BD140`, `TIP31C`, `TIP32C`, `2N3055`, `MJ2955` | University lab standard **SL100 / SK100** pair for CE/CB/CC characteristics and biasing; **BD139/140** & **TIP31C/32C** for Class B/AB Push-Pull power amplifiers; **2N3055/MJ2955** high-power transistors. |
| **JFET** | `BFW10`, `BFW11`, `2N3819`, `2N5457`, `2N5460` | Textbook standard **BFW10** ($V_p \approx -2.3\text{V}$) for drain & transfer characteristics and CS amplifiers; Complementary P-channel JFET (`2N5460`). |
| **MOSFET** | `2N7000`, `BS170`, `IRF540N`, `IRF9540N`, `3N163` | Enhancement-mode switches and **3N163 Depletion-mode MOSFET** for syllabus comparison of enhancement vs depletion behavior. |
| **UJT & Thyristors** | `2N2646`, `2N2647`, `2N6027`, `2N5060`, `BT136`, `DB3` | **2N2646 Unijunction Transistor (UJT)** for Relaxation Oscillators and sawtooth generators; **2N6027** Programmable UJT (PUT); **BT136** TRIAC; **2N5060** SCR; **DB3** DIAC. |
| **Amplifiers** | `LM386`, `MAT02` | **LM386** Low-Voltage Audio Power Amplifier IC; **MAT02** Ultra-low noise matched differential BJT pair for Differential Amplifier experiments. |
| **OPAMP** | `LM741`, `TL082`, `LM358`, `LM317`, `LM7905`, `LM7912`, `LM7915` | Classic **LM741**, high-speed JFET **TL082**, single-supply **LM358**, positive adjustable **LM317**, and negative fixed regulators (**LM7905/12/15**). |
| **74LSx_Series** | `74LS90`, `74LS93`, `74LS95` | **74LS90** Decade Counter, **74LS93** 4-bit Binary Counter, **74LS95** 4-bit Shift Register. |
| **Flipflop** | `DFlipFlop`, `JK` | Edge-triggered D Flip-Flop and JK Flip-Flop for sequential logic circuits. |

---

## ⚡ Key Features

1. **Dual-Tier Installation Engine**:
   - Symbols (`.asy`) placed cleanly into `lib\sym\<Category>\` (organized inside the F2 component browser).
   - Models (`.lib`/`.sub`) copied to both `lib\sub\<Category>\` and globally into `lib\sub\`, ensuring zero missing subcircuit errors.
   - **Native Component Database Sync**: Safely updates `standard.dio`, `standard.bjt`, `standard.jft`, and `standard.mos` (with automatic `.bak` backups and UTF-16LE / Latin-1 encoding detection). All discrete components appear directly in LTspice's right-click "Pick New Diode/Transistor" dialog!
2. **Built-in SPICE Code Inspector**:
   - Click the **👁 Code** button next to any component to inspect the underlying SPICE syntax, equations, and symbol attributes with one-click clipboard copying.
3. **Smart Search & Filters**:
   - Instant search matching component names, categories, and technical descriptions (e.g. search "germanium" or "relaxation").
4. **Auto-Detection for LTspice**:
   - Automatically checks `%LOCALAPPDATA%\LTspice`, `Documents\LTspiceXVII`, and standard Program Files install paths.
5. **AI Code Paste Wizard**:
   - Add custom models by pasting `.asy` and `.lib` code directly from AI or uploading local files.

---

## 🚀 How to Build & Run on Windows

### Step 1 — Build Single-File Standalone EXE
1. Copy the `Ltspice component adder` folder to your Windows PC.
2. Double-click **`build.bat`**.
3. It automatically verifies Python, installs dependencies (`customtkinter`, `pyinstaller`, `pillow`), and compiles a standalone executable into `dist\`.

### Step 2 — Run the App
1. Open `dist\`.
2. Double-click **`ltspice component adder - by Basi.exe`**.

### Step 3 — Install Components
1. Click **⚡ Auto Detect** (or **Browse**) to set your LTspice installation path.
2. Click **📦 Install All 59 Components** or select specific categories.
3. Click **Install Selected →**.
4. Open or restart LTspice — all components are ready for immediate simulation!
