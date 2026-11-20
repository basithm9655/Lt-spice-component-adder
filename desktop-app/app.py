import customtkinter as ctk
import tkinter as tk
from tkinter import filedialog, messagebox
import os
import shutil
import sys
import json
import threading
import urllib.request
import webbrowser
import tempfile

# ── Windows 10/11 DPI & Low-End Laptop Performance Optimization ──────────────
try:
    import ctypes
    # Per-monitor DPI awareness V2 (Windows 10 1703+ and Windows 11)
    ctypes.windll.shcore.SetProcessDpiAwareness(2)
except Exception:
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass

APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyk3JOdD3ZquBDauFUaKAL-cSX1DEZno1jiSuZPpclmJOnNsmvoQH-UAlChKrnztsg/exec"

# ── Internet / Online Check ────────────────────────────────────────────────────
def is_online():
    try:
        urllib.request.urlopen("https://www.google.com", timeout=3)
        return True
    except Exception:
        return False

# ── Upload new component metadata to sheet in background ──────────────────────
def upload_component_to_sheet(comp_name, category, asy_code="", lib_code="", sub_code=""):
    def _upload():
        try:
            data = json.dumps({
                "action": "add_component",
                "name": comp_name,
                "category": category,
                "asy": asy_code,
                "lib": lib_code,
                "sub": sub_code
            }).encode('utf-8')
            req = urllib.request.Request(
                APPS_SCRIPT_URL, data=data,
                headers={'Content-Type': 'application/json'}, method='POST'
            )
            urllib.request.urlopen(req, timeout=10)
        except Exception:
            pass
    threading.Thread(target=_upload, daemon=True).start()

# ── Fetch components from sheet ───────────────────────────────────────────────
def fetch_sheet_components():
    """Download component list from sheet. Returns list of dicts or empty list."""
    try:
        url = APPS_SCRIPT_URL + "?action=get_components"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get("components", [])
    except Exception:
        return []

# ── Theme & Global Settings ───────────────────────────────────────────────────
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

APP_W, APP_H = 1000, 680

if getattr(sys, "frozen", False):
    EXE_DIR    = os.path.dirname(sys.executable)
    BUNDLE_DIR = getattr(sys, "_MEIPASS", EXE_DIR)
else:
    EXE_DIR    = os.path.dirname(os.path.abspath(__file__))
    BUNDLE_DIR = EXE_DIR

MODELS_ROOT  = os.path.join(BUNDLE_DIR, "Lt-Spice-models-main", "LTspice_Models")
USER_MODELS  = os.path.join(EXE_DIR, "MyComponents")   # user-added components folder
CONFIG_FILE  = os.path.join(EXE_DIR, "ltspice_path.json")
ICON_PATH    = os.path.join(BUNDLE_DIR, "icon.ico")

LTSPICE_CANDIDATES = [
    os.path.expandvars(r"%LOCALAPPDATA%\LTspice"),
    os.path.expandvars(r"%USERPROFILE%\Documents\LTspiceXVII"),
    os.path.expandvars(r"%USERPROFILE%\Documents\LTspice"),
    r"C:\Program Files\ADI\LTspice",
    r"C:\Program Files\LTC\LTspiceXVII",
    r"C:\Program Files\LTC\LTspice",
    # Wine / Linux testing fallbacks
    os.path.expanduser("~/.wine/drive_c/users/basi/AppData/Local/LTspice"),
    os.path.expanduser("~/.wine/drive_c/Program Files/ADI/LTspice"),
]

# Extension → LTspice subfolder mapping
EXT_MAP = {
    ".asy": "sym",
    ".lib": "sub",
    ".sub": "sub",
    ".mod": "sub",
    ".cir": "sub"
}

# ── Standard Component Database Definitions (for native right-click picker) ───
STANDARD_MODELS = {
    "standard.dio": [
        ".model 1N34A D(Is=2.6u Rs=6.5 N=1.6 Cjo=0.8p Eg=0.67 Bv=75 Ibv=1m type=Germanium mfg=General_Instrument)",
        ".model OA79 D(Is=12.5u Rs=40 N=2.2 Cjo=1p Eg=0.67 Bv=45 Ibv=100u type=Germanium mfg=Mullard)",
        ".model OA91 D(Is=2.6u Rs=3.5 N=1.60 Cjo=0.7p Eg=0.67 Bv=115 Ibv=100u Tt=5n type=Germanium mfg=Mullard)",
        ".model 1N270 D(Is=1.24u Rs=2.42 N=1.675 Cjo=4.0p Eg=0.67 Bv=100 Ibv=1m Tt=21n type=Germanium mfg=Microsemi)",
        ".model 1N60 D(Is=3.5u Rs=12 N=1.55 Cjo=1.0p Eg=0.67 Bv=45 Ibv=100u Tt=100n type=Germanium mfg=General_Instrument)",
        ".model IDEAL_DIODE D(Ron=1m Roff=100Meg Vfwd=0.0 Vrev=1000 mfg=Academic type=Ideal)",
        ".model BB105 D(Is=1e-14 Rs=0.5 Cjo=18p Vj=2.0 M=1.05 Bv=30 Ibv=10u mfg=Philips type=Varactor)",
        ".model BAR64 D(Is=1.5e-14 Rs=0.85 N=1.05 Tt=1.5u Cjo=0.23p Vj=0.7 Bv=150 Ibv=10u mfg=Infineon type=PIN)",
        ".model BZX55C3V3 D(Is=1e-11 Rs=55 Bv=3.3 Ibv=5m Nbv=1.5 Tbv1=-0.48m Cjo=120p mfg=Vishay type=Zener)",
        ".model BZX55C5V1 D(Is=1e-12 Rs=10 Bv=5.1 Ibv=5m Nbv=1.2 Tbv1=0.0 Cjo=80p mfg=Vishay type=Zener)",
        ".model BZX55C6V2 D(Is=1e-13 Rs=6  Bv=6.2 Ibv=5m Nbv=1.1 Tbv1=0.32m Cjo=60p mfg=Vishay type=Zener)",
        ".model BZX55C9V1 D(Is=1e-14 Rs=8  Bv=9.1 Ibv=5m Nbv=1.1 Tbv1=0.49m Cjo=40p mfg=Vishay type=Zener)",
        ".model LED_RED D(Is=1e-18 Rs=2.5 N=1.8 Cjo=15p Eg=1.9 Vpk=5 Iave=30m mfg=Generic type=LED)",
        ".model LED_GREEN D(Is=1e-19 Rs=3.0 N=2.0 Cjo=15p Eg=2.2 Vpk=5 Iave=30m mfg=Generic type=LED)",
        ".model LED_BLUE D(Is=1e-22 Rs=5.0 N=2.5 Cjo=20p Eg=3.2 Vpk=5 Iave=30m mfg=Generic type=LED)",
    ],
    "standard.bjt": [
        ".model SL100 NPN(Is=1.5e-13 Bf=150 Vaf=100 Ikf=0.5 Xtb=1.5 Cje=25p Cjc=12p Tf=1.6n Tr=15n Rb=5 Rc=0.4 Re=0.1 mfg=CDIL)",
        ".model SK100 PNP(Is=1.5e-13 Bf=150 Vaf=100 Ikf=0.5 Xtb=1.5 Cje=25p Cjc=12p Tf=1.6n Tr=15n Rb=5 Rc=0.4 Re=0.1 mfg=CDIL)",
        ".model BC547 NPN(Is=7.04e-14 Bf=300 Vaf=90.7 Ikf=0.12 Xtb=1.5 Cje=11.5p Cjc=4.5p Tf=0.45n Tr=20n mfg=Philips)",
        ".model BC548 NPN(Is=7.04e-14 Bf=250 Vaf=80 Ikf=0.12 Xtb=1.5 Cje=11.5p Cjc=4.5p Tf=0.45n Tr=20n mfg=Philips)",
        ".model BC557 PNP(Is=1.02e-13 Bf=300 Vaf=75.6 Ikf=0.1 Xtb=1.5 Cje=12p Cjc=6p Tf=0.5n Tr=20n mfg=Philips)",
        ".model BC558 PNP(Is=1.02e-13 Bf=250 Vaf=70 Ikf=0.1 Xtb=1.5 Cje=12p Cjc=6p Tf=0.5n Tr=20n mfg=Philips)",
        ".model BD139 NPN(Is=2.3e-13 Bf=160 Vaf=120 Ikf=1.5 Xtb=1.5 Cje=60p Cjc=25p Tf=0.8n Tr=30n Rc=0.2 Rb=2 mfg=ST)",
        ".model BD140 PNP(Is=2.3e-13 Bf=160 Vaf=120 Ikf=1.5 Xtb=1.5 Cje=60p Cjc=30p Tf=0.8n Tr=30n Rc=0.2 Rb=2 mfg=ST)",
        ".model TIP31C NPN(Is=1.2e-11 Bf=80 Vaf=100 Ikf=3.0 Xtb=1.5 Cje=150p Cjc=80p Tf=53n Tr=400n Rc=0.1 Rb=1 mfg=OnSemi)",
        ".model TIP32C PNP(Is=1.2e-11 Bf=80 Vaf=100 Ikf=3.0 Xtb=1.5 Cje=150p Cjc=90p Tf=53n Tr=400n Rc=0.1 Rb=1 mfg=OnSemi)",
        ".model 2N3055 NPN(Is=2.5e-11 Bf=60 Vaf=70 Ikf=8.0 Xtb=1.5 Cje=400p Cjc=200p Tf=64n Tr=500n Rc=0.05 Rb=0.5 mfg=Motorola)",
        ".model MJ2955 PNP(Is=2.5e-11 Bf=60 Vaf=70 Ikf=8.0 Xtb=1.5 Cje=400p Cjc=220p Tf=64n Tr=500n Rc=0.05 Rb=0.5 mfg=Motorola)",
    ],
    "standard.jft": [
        ".model BFW10 NJF(Vto=-2.3 Beta=2.03m Lambda=23m Rd=7.8 Rs=7.8 Cgs=2p Cgd=2.2p Pb=0.99 Is=0.26f mfg=Philips)",
        ".model BFW11 NJF(Vto=-2.1 Beta=1.6m Lambda=25m Rd=17 Rs=17 Cgs=2.3p Cgd=2.3p Pb=0.93 Is=0.22f mfg=Philips)",
        ".model 2N3819 NJF(Vto=-3.0 Beta=1.3m Lambda=20m Rd=12 Rs=12 Cgs=2.5p Cgd=2.5p Is=1e-14 mfg=Fairchild)",
        ".model 2N5457 NJF(Vto=-2.0 Beta=0.9m Lambda=15m Rd=15 Rs=15 Cgs=3p Cgd=3p Is=1e-14 mfg=OnSemi)",
        ".model 2N5460 PJF(Vto=-2.5 Beta=0.8m Lambda=15m Rd=25 Rs=25 Cgs=3p Cgd=3p Is=1e-14 mfg=OnSemi)",
    ],
    "standard.mos": [
        ".model 2N7000 VDMOS(Vto=2.1 Kp=0.25 Rs=0.5 Rd=1.5 Cgs=35p Cgdmax=20p Cgdmin=5p mfg=OnSemi)",
        ".model BS170 VDMOS(Vto=2.0 Kp=0.30 Rs=0.4 Rd=1.2 Cgs=40p Cgdmax=25p Cgdmin=6p mfg=OnSemi)",
        ".model IRF540N VDMOS(Vto=4.0 Kp=15 Rs=12m Rd=20m Cgs=1.5n Cgdmax=600p Cgdmin=50p mfg=IR)",
        ".model IRF9540N VDMOS(pchan Vto=-4.0 Kp=10 Rs=25m Rd=50m Cgs=1.4n Cgdmax=700p Cgdmin=80p mfg=IR)",
        ".model 3N163 VDMOS(Vto=-2.5 Kp=2m Lambda=0.01 Rs=2 Rd=5 Cgs=10p Cgdmax=10p Cgdmin=2p mfg=Siliconix)",
    ]
}

# ── Helper Functions ──────────────────────────────────────────────────────────

def load_cfg():
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, "r") as f:
                return json.load(f)
    except Exception:
        pass
    return {}

def save_cfg(d):
    try:
        with open(CONFIG_FILE, "w") as f:
            json.dump(d, f, indent=2)
    except Exception:
        pass

def detect_ltspice():
    for p in LTSPICE_CANDIDATES:
        if os.path.isdir(p):
            return p
    return ""

_ASY_DESC_CACHE = {}

def get_asy_description(asy_path):
    """Extract SYMATTR Description from .asy symbol file if present (cached)."""
    if not asy_path or not os.path.exists(asy_path):
        return ""
    if asy_path in _ASY_DESC_CACHE:
        return _ASY_DESC_CACHE[asy_path]
    try:
        with open(asy_path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                if line.startswith("SYMATTR Description"):
                    d = line.split("SYMATTR Description", 1)[1].strip()
                    _ASY_DESC_CACHE[asy_path] = d
                    return d
    except Exception:
        pass
    _ASY_DESC_CACHE[asy_path] = ""
    return ""

def scan_categories(bundled_only=False):
    """Scan bundled MODELS_ROOT, user MyComponents, and optionally sheet."""
    result = {}

    # Scan bundled models
    if os.path.isdir(MODELS_ROOT):
        for cat in sorted(os.listdir(MODELS_ROOT)):
            cat_path = os.path.join(MODELS_ROOT, cat)
            if not os.path.isdir(cat_path):
                continue
            by_name = {}
            for f in os.listdir(cat_path):
                base, ext = os.path.splitext(f)
                if ext.lower() in EXT_MAP:
                    by_name.setdefault(base, []).append(f)
            comps = []
            for n, fs in sorted(by_name.items()):
                asy_f = os.path.join(cat_path, f"{n}.asy")
                desc = get_asy_description(asy_f)
                comps.append({
                    "name": n,
                    "category": cat,
                    "files": fs,
                    "path": cat_path,
                    "source": "bundled",
                    "desc": desc
                })
            if comps:
                result[cat] = comps

    # Scan user MyComponents
    if os.path.isdir(USER_MODELS):
        for cat in sorted(os.listdir(USER_MODELS)):
            cat_path = os.path.join(USER_MODELS, cat)
            if not os.path.isdir(cat_path):
                continue
            by_name = {}
            for f in os.listdir(cat_path):
                base, ext = os.path.splitext(f)
                if ext.lower() in EXT_MAP:
                    by_name.setdefault(base, []).append(f)
            comps = []
            for n, fs in sorted(by_name.items()):
                asy_f = os.path.join(cat_path, f"{n}.asy")
                desc = get_asy_description(asy_f)
                comps.append({
                    "name": n,
                    "category": cat,
                    "files": fs,
                    "path": cat_path,
                    "source": "user",
                    "desc": desc
                })
            if comps:
                existing = result.get(cat, [])
                seen = {c["name"] for c in existing}
                result[cat] = existing + [c for c in comps if c["name"] not in seen]

    return result

def is_ltspice_running():
    try:
        import subprocess
        out = subprocess.run(["tasklist"], capture_output=True, text=True, creationflags=0x08000000).stdout.lower()
        return any(proc in out for proc in ("ltspice.exe", "xviix64.exe", "xviix86.exe"))
    except Exception:
        return False

def sync_standard_cmp_databases(ltspice_root, log_list=None):
    """
    Safely upserts discrete models into standard.dio, standard.bjt, standard.jft, standard.mos
    so that they appear in the native LTspice right-click component selector.
    Automatically detects UTF-16LE, UTF-8, and Latin-1 encodings and creates .bak backups.
    """
    if not ltspice_root or not os.path.isdir(ltspice_root):
        return 0, []

    cmp_dir = os.path.join(ltspice_root, "lib", "cmp")
    if not os.path.isdir(cmp_dir):
        if os.path.isdir(os.path.join(ltspice_root, "cmp")):
            cmp_dir = os.path.join(ltspice_root, "cmp")
        else:
            return 0, []

    synced_count = 0
    synced_logs = []

    for filename, lines in STANDARD_MODELS.items():
        file_path = os.path.join(cmp_dir, filename)
        if not os.path.exists(file_path):
            continue

        bak_path = file_path + ".bak"
        if not os.path.exists(bak_path):
            try:
                shutil.copy2(file_path, bak_path)
            except Exception:
                pass

        try:
            with open(file_path, "rb") as bf:
                raw_bytes = bf.read(200)
            if raw_bytes.startswith(b"\xff\xfe"):
                enc = "utf-16le"
            elif raw_bytes.startswith(b"\xfe\xff"):
                enc = "utf-16be"
            elif raw_bytes.startswith(b"\xef\xbb\xbf"):
                enc = "utf-8-sig"
            elif b"\x00" in raw_bytes:
                enc = "utf-16le"
            else:
                try:
                    with open(file_path, "r", encoding="utf-8") as tf:
                        tf.read()
                    enc = "utf-8"
                except Exception:
                    enc = "latin-1"

            with open(file_path, "r", encoding=enc, errors="ignore") as rf:
                content_lines = rf.read().splitlines()

            updated_count = 0
            for model_line in lines:
                parts = model_line.strip().split()
                if len(parts) >= 2:
                    model_name = parts[1]
                    pat = re.compile(rf"^\s*\.model\s+{re.escape(model_name)}\s+", re.IGNORECASE)
                    replaced = False
                    for idx, existing_line in enumerate(content_lines):
                        if pat.match(existing_line):
                            content_lines[idx] = model_line.strip()
                            replaced = True
                            updated_count += 1
                            break
                    if not replaced:
                        content_lines.append(model_line.strip())
                        updated_count += 1

            if updated_count > 0:
                with open(file_path, "w", encoding=enc, newline="\n") as wf:
                    wf.write("\n".join(content_lines) + "\n")
                synced_count += updated_count
                msg = f"✔ SYNC: {updated_count} models updated/added in lib\\cmp\\{filename}"
                synced_logs.append(msg)
                if log_list is not None:
                    log_list.append(msg)
        except Exception as e:
            err = f"✘ DB SYNC: Failed for {filename} ({str(e)})"
            synced_logs.append(err)
            if log_list is not None:
                log_list.append(err)

    return synced_count, synced_logs

def install_components_verified(components, ltspice_root, progress_callback=None):
    """
    Copy files to LTspice directories and strictly verify they are pasted properly.
    Copies .asy to lib/sym/<category>/
    Copies .lib/.sub to BOTH lib/sub/<category>/ AND lib/sub/ (ensuring global search resolution).
    Also synchronizes standard.dio/bjt/jft/mos so components appear in native right-click dropdown.
    Returns (copied_files_count, error_list, detail_log)
    """
    ok, errors, log = 0, [], []
    total_files = sum(len(comp["files"]) for comp in components)
    if total_files == 0:
        total_files = 1
    processed = 0

    for comp in components:
        for fname in comp["files"]:
            ext = os.path.splitext(fname)[1].lower()
            sub = EXT_MAP.get(ext, "sub")
            dest_dir = os.path.join(ltspice_root, "lib", sub, comp["category"])
            os.makedirs(dest_dir, exist_ok=True)

            src = os.path.join(comp["path"], fname)
            dst = os.path.join(dest_dir, fname)

            try:
                # Direct file copy to category folder
                shutil.copy2(src, dst)

                # Strict verification check
                if os.path.exists(dst) and os.path.getsize(dst) == os.path.getsize(src):
                    ok += 1
                    log.append(f"✔ VERIFIED: lib\\{sub}\\{comp['category']}\\{fname}")
                else:
                    raise IOError("Verification failed: File missing or size mismatch after copying.")

                # If this is a library or subcircuit, ALSO copy to root lib/sub
                # so that schematics referencing just ModelFile name will find it immediately!
                if sub == "sub":
                    global_sub = os.path.join(ltspice_root, "lib", "sub")
                    os.makedirs(global_sub, exist_ok=True)
                    dst_global = os.path.join(global_sub, fname)
                    shutil.copy2(src, dst_global)
                    if os.path.exists(dst_global) and os.path.getsize(dst_global) == os.path.getsize(src):
                        log.append(f"  ↳ Linked globally in lib\\sub\\{fname}")

            except Exception as e:
                errors.append(f"✘ FAILED: {fname} - {str(e)}")
                log.append(f"✘ FAILED: lib\\{sub}\\{comp['category']}\\{fname} - {str(e)}")

            processed += 1
            if progress_callback:
                progress_callback(processed / total_files)

    # Synchronize standard component databases
    db_count, db_logs = sync_standard_cmp_databases(ltspice_root, log)
    if db_count > 0:
        log.append(f"✔ VERIFIED: {db_count} models synced into LTspice native component picker.")

    return ok, errors, log


# ── Premium Custom Canvas Logo Widget ──────────────────────────────────────────

class PremiumLogo(ctk.CTkCanvas):
    def __init__(self, master, **kwargs):
        kwargs.setdefault("width", 54)
        kwargs.setdefault("height", 54)
        kwargs.setdefault("bg", "#0a0a18")
        kwargs.setdefault("highlightthickness", 0)
        super().__init__(master, **kwargs)
        self.draw_logo()

    def draw_logo(self):
        self.delete("all")
        # Glow circles
        self.create_oval(8, 8, 46, 46, fill="#131335", outline="#1d4ed8", width=1.5)
        self.create_oval(16, 16, 38, 38, fill="#1e3a8a", outline="", width=0)
        # Lightning bolt points
        pts = [27, 8, 36, 24, 28, 24, 31, 46, 18, 28, 26, 28]
        self.create_polygon(pts, fill="#5b9bf5", outline="#93c5fd", width=1)
        # Accent circuit node
        self.create_line(36, 24, 46, 24, fill="#93c5fd", width=2)
        self.create_oval(44, 21, 50, 27, fill="#60a5fa", outline="")


# ── Main Application Class ─────────────────────────────────────────────────────

class App(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("LTspice Component Adder Pro")
        self.geometry(f"{APP_W}x{APP_H}")
        self.minsize(920, 600)

        # Set Window Icon
        if os.path.exists(ICON_PATH):
            try:
                self.iconbitmap(ICON_PATH)
            except Exception:
                pass

        # Always on Top functionality
        self.is_topmost = False

        # Load Path Configurations
        self.cfg = load_cfg()
        self.ltspice_path = self.cfg.get("ltspice_path", detect_ltspice())
        self.categories = scan_categories()
        self.active_cat = tk.StringVar()
        self.check_vars: dict[str, tk.BooleanVar] = {}

        self._search_timer = None
        self._render_job = None
        self._pending_comps = []

        self._build_ui()
        self._populate_categories()
        self._check_announcement()
        self._load_sheet_components()

    def _check_announcement(self):
        def fetch():
            try:
                req = urllib.request.Request(APPS_SCRIPT_URL)
                with urllib.request.urlopen(req, timeout=5) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    msg = data.get("message", "").strip()
                    link = data.get("link", "").strip()
                    if msg:
                        self.after(0, lambda: self._show_announcement(msg, link))
            except Exception:
                pass
        threading.Thread(target=fetch, daemon=True).start()

    def _load_sheet_components(self):
        """Fetch components from Google Sheet and merge into categories in background."""
        def fetch():
            comps = fetch_sheet_components()
            if not comps:
                return
            added = False
            for c in comps:
                name = c.get("name", "").strip()
                cat = c.get("category", "").strip()
                if not name or not cat:
                    continue
                entry = {"name": name, "category": cat, "files": [], "path": "",
                         "source": "sheet",
                         "desc": c.get("desc", "Community cloud component"),
                         "asy": c.get("asy", ""), "lib": c.get("lib", ""),
                         "sub": c.get("sub", "")}
                existing = self.categories.get(cat, [])
                if not any(x["name"] == name for x in existing):
                    self.categories.setdefault(cat, []).append(entry)
                    added = True
            if added:
                self.after(0, self._refresh_categories_silent)

        threading.Thread(target=fetch, daemon=True).start()

    def _refresh_categories_silent(self):
        current_cat = self.active_cat.get()
        self._populate_categories()
        if current_cat and current_cat in self.categories:
            self._select_cat(current_cat)

    def _show_announcement(self, msg, link):
        win = ctk.CTkToplevel(self)
        win.title("Announcement")
        win.geometry("460x260")
        win.attributes("-topmost", True)

        ctk.CTkLabel(win, text=msg, wraplength=400, font=ctk.CTkFont(size=14)).pack(pady=(30, 20), padx=20)

        if link:
            ctk.CTkButton(win, text="Open Link", fg_color="#2563eb", hover_color="#1d4ed8",
                          command=lambda: webbrowser.open(link)).pack(pady=5)

        ctk.CTkButton(win, text="Close", fg_color="#333344", hover_color="#444455",
                          command=win.destroy).pack(pady=(10, 20))

    def _build_ui(self):
        # Grid Configuration
        self.grid_columnconfigure(0, weight=0)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(1, weight=1)

        # ── 1. Top Premium Header Bar ──────────────────────────────────────────
        hdr = ctk.CTkFrame(self, fg_color="#0a0a18", corner_radius=0, height=80)
        hdr.grid(row=0, column=0, columnspan=2, sticky="ew")
        hdr.grid_propagate(False)
        hdr.grid_columnconfigure(2, weight=1)

        # App Logo & Branding
        logo_canvas = PremiumLogo(hdr)
        logo_canvas.grid(row=0, column=0, padx=(18, 12), pady=12, sticky="w")

        title_frame = ctk.CTkFrame(hdr, fg_color="transparent")
        title_frame.grid(row=0, column=1, pady=10, sticky="w")

        ctk.CTkLabel(title_frame, text="LTspice Component Adder Pro",
                     font=ctk.CTkFont("Segoe UI", 18, "bold"),
                     text_color="#5b9bf5").pack(anchor="w")

        credits_lbl = ctk.CTkLabel(title_frame, text="Syllabus & Standard Semiconductor Library • Built by Basi",
                                    font=ctk.CTkFont("Segoe UI", 11),
                                    text_color="#94a3b8")
        credits_lbl.pack(anchor="w")

        # LTspice Installation Path Directory Picker Frame
        pf = ctk.CTkFrame(hdr, fg_color="#111125", corner_radius=8, height=48)
        pf.grid(row=0, column=3, padx=20, pady=16, sticky="e")

        ctk.CTkLabel(pf, text="LTspice Path:", font=ctk.CTkFont(size=11, weight="bold"),
                     text_color="#94a3b8").pack(side="left", padx=(12, 6))

        self.path_lbl = ctk.CTkLabel(pf,
                                     text=self._short(self.ltspice_path) or "Not Found (Click Auto Detect / Browse)",
                                     font=ctk.CTkFont(family="Consolas", size=11),
                                     text_color="#38bdf8" if self.ltspice_path else "#ef4444",
                                     width=260, anchor="w")
        self.path_lbl.pack(side="left", padx=4)

        ctk.CTkButton(pf, text="⚡ Auto Detect", width=95, height=28,
                      font=ctk.CTkFont(size=11, weight="bold"),
                      fg_color="#0f766e", hover_color="#0d9488",
                      command=self._auto_detect).pack(side="left", padx=4)

        ctk.CTkButton(pf, text="Browse", width=70, height=28,
                      font=ctk.CTkFont(size=11, weight="bold"),
                      fg_color="#1d4ed8", hover_color="#2563eb",
                      command=self._browse).pack(side="left", padx=(4, 8))

        # ── 2. Sidebar (Categories) ───────────────────────────────────────────
        sb = ctk.CTkFrame(self, fg_color="#0f0f1e", corner_radius=0, width=240)
        sb.grid(row=1, column=0, sticky="nsew")
        sb.grid_propagate(False)

        total_comps = sum(len(c) for c in self.categories.values())
        self.cat_header_lbl = ctk.CTkLabel(sb, text=f"LIBRARY CATEGORIES ({total_comps})",
                                           font=ctk.CTkFont("Segoe UI", 10, "bold"),
                                           text_color="#64748b")
        self.cat_header_lbl.pack(pady=(16, 6), padx=16, anchor="w")

        self.cat_scroll = ctk.CTkScrollableFrame(sb, fg_color="transparent", corner_radius=0)
        self.cat_scroll.pack(fill="both", expand=True, padx=8, pady=(0, 6))
        self.cat_btns: dict[str, ctk.CTkButton] = {}

        # Quick Actions in Sidebar
        qa_frame = ctk.CTkFrame(sb, fg_color="#151528", corner_radius=8)
        qa_frame.pack(fill="x", padx=10, pady=(0, 8))

        ctk.CTkButton(qa_frame, text="⚡ Sync Native Databases", height=30,
                      font=ctk.CTkFont(size=11, weight="bold"),
                      fg_color="#0284c7", hover_color="#0369a1",
                      command=self._sync_databases_dialog).pack(pady=(8, 4), padx=10, fill="x")

        ctk.CTkButton(qa_frame, text=f"📦 Install All {total_comps} Components", height=30,
                      font=ctk.CTkFont(size=11, weight="bold"),
                      fg_color="#16a34a", hover_color="#15803d",
                      command=self._install_all_components).pack(pady=(0, 8), padx=10, fill="x")

        # Feedback Section
        fb_frame = ctk.CTkFrame(sb, fg_color="#131322", corner_radius=8)
        fb_frame.pack(fill="x", padx=10, pady=(0, 12))
        ctk.CTkButton(fb_frame, text="💬 Request Component / Feedback", height=28, font=ctk.CTkFont(size=10, weight="bold"),
                      fg_color="#334155", hover_color="#475569",
                      command=self._feedback_dialog).pack(pady=6, padx=10, fill="x")

        # ── 3. Main Center Display Panel ──────────────────────────────────────
        rp = ctk.CTkFrame(self, fg_color="#13131f", corner_radius=0)
        rp.grid(row=1, column=1, sticky="nsew")
        rp.grid_rowconfigure(1, weight=1)
        rp.grid_columnconfigure(0, weight=1)

        # Upper Controls Frame
        tr = ctk.CTkFrame(rp, fg_color="transparent")
        tr.grid(row=0, column=0, sticky="ew", padx=20, pady=(16, 8))
        tr.grid_columnconfigure(0, weight=1)

        self.sv = tk.StringVar()
        self.sv.trace_add("write", self._on_search_changed)
        ctk.CTkEntry(tr, textvariable=self.sv,
                     placeholder_text="🔍 Search component models or descriptions (e.g. germanium, zener, BFW10, SL100)...",
                     height=36, corner_radius=8,
                     font=ctk.CTkFont(size=13),
                     fg_color="#1e1e30", border_color="#2e2e4a"
                     ).grid(row=0, column=0, sticky="ew", padx=(0, 12))

        self.sel_btn = ctk.CTkButton(tr, text="Select All", width=105, height=36,
                                     font=ctk.CTkFont(size=12, weight="bold"),
                                     fg_color="#1e1e35", hover_color="#2d2d44",
                                     border_width=1, border_color="#3b3b55",
                                     command=self._toggle_all)
        self.sel_btn.grid(row=0, column=1)

        # Component List Box
        self.comp_list = ctk.CTkScrollableFrame(rp, fg_color="transparent", corner_radius=0)
        self.comp_list.grid(row=1, column=0, sticky="nsew", padx=16, pady=(0, 8))
        self.comp_list.grid_columnconfigure(0, weight=1)

        self.empty_lbl = ctk.CTkLabel(self.comp_list, text="← Select a category to display components",
                                      font=ctk.CTkFont(size=13), text_color="#475569")
        self.empty_lbl.grid(row=0, column=0, pady=120)

        # ── 4. Bottom Premium Status & Execution Bar ──────────────────────────
        ft = ctk.CTkFrame(self, fg_color="#0a0a18", corner_radius=0, height=68)
        ft.grid(row=2, column=0, columnspan=2, sticky="ew")
        ft.grid_propagate(False)
        ft.grid_columnconfigure(2, weight=1)

        # Status text display
        self.status = tk.StringVar(value="Ready. Select components to install.")
        ctk.CTkLabel(ft, textvariable=self.status,
                     font=ctk.CTkFont("Segoe UI", 12), text_color="#94a3b8"
                     ).grid(row=0, column=1, padx=(18, 16), pady=20, sticky="w")

        # Visual installation progress bar
        self.pbar = ctk.CTkProgressBar(ft, width=180, height=6, fg_color="#1e1e30", progress_color="#10b981")
        self.pbar.grid(row=0, column=2, padx=16, pady=25, sticky="we")
        self.pbar.set(0)

        # Functional Buttons Container
        bf = ctk.CTkFrame(ft, fg_color="transparent")
        bf.grid(row=0, column=3, padx=20, pady=12, sticky="e")

        ctk.CTkButton(bf, text="＋ Add Custom Component",
                      width=190, height=40,
                      font=ctk.CTkFont(size=13, weight="bold"),
                      fg_color="#1e1e35", hover_color="#2d2d44",
                      border_width=1, border_color="#3b3b55",
                      command=self._add_dialog).pack(side="left", padx=(0, 12))

        self.inst_btn = ctk.CTkButton(bf, text="Install Selected  →",
                                      width=180, height=40,
                                      font=ctk.CTkFont(size=13, weight="bold"),
                                      fg_color="#2563eb", hover_color="#3b82f6",
                                      command=self._install)
        self.inst_btn.pack(side="left")

    # ── Category Browser Setup ─────────────────────────────────────────────────

    def _populate_categories(self):
        for w in self.cat_scroll.winfo_children():
            w.destroy()
        self.cat_btns.clear()

        total_comps = sum(len(c) for c in self.categories.values())
        if hasattr(self, "cat_header_lbl"):
            self.cat_header_lbl.configure(text=f"LIBRARY CATEGORIES ({total_comps})")

        if not self.categories:
            ctk.CTkLabel(self.cat_scroll, text="No components found",
                         text_color="#64748b").pack(pady=20)
            return

        for cat in self.categories:
            n = len(self.categories[cat])
            b = ctk.CTkButton(self.cat_scroll,
                              text=f"  {cat}   ({n})", anchor="w",
                              height=38, corner_radius=6,
                              font=ctk.CTkFont(size=12, weight="bold"),
                              fg_color="transparent", hover_color="#1e1e35",
                              text_color="#cbd5e1",
                              command=lambda c=cat: self._select_cat(c))
            b.pack(fill="x", pady=2, padx=4)
            self.cat_btns[cat] = b

        if self.categories:
            current = self.active_cat.get()
            if not current or current not in self.categories:
                self._select_cat("Diodes" if "Diodes" in self.categories else next(iter(self.categories)))

    def _select_cat(self, cat):
        self.active_cat.set(cat)
        for c, b in self.cat_btns.items():
            b.configure(fg_color="#1e293b" if c == cat else "transparent",
                        text_color="#38bdf8" if c == cat else "#cbd5e1")
        if self.sv.get():
            self.sv.set("")
        else:
            self._render(self.categories.get(cat, []))

    def _on_search_changed(self, *args):
        if hasattr(self, "_search_timer") and self._search_timer:
            self.after_cancel(self._search_timer)
        self._search_timer = self.after(100, self._filter)

    def _filter(self):
        q = self.sv.get().lower().strip()
        if not q:
            cat = self.active_cat.get()
            comps = self.categories.get(cat, [])
            self._render(comps)
            return

        # Global search across all categories for smooth discovery
        filtered = []
        for cat_name, cat_comps in self.categories.items():
            for c in cat_comps:
                if (q in c["name"].lower() or 
                    q in c.get("desc", "").lower() or 
                    q in cat_name.lower()):
                    filtered.append(c)
        self._render(filtered)

    def _render(self, comps):
        # Cancel any active progressive rendering job
        if hasattr(self, "_render_job") and self._render_job:
            self.after_cancel(self._render_job)
            self._render_job = None

        for w in self.comp_list.winfo_children():
            w.destroy()
        self.check_vars.clear()

        if not comps:
            ctk.CTkLabel(self.comp_list, text="No components match your search filter",
                         text_color="#64748b", font=ctk.CTkFont(size=13)
                         ).grid(row=0, column=0, pady=100)
            return

        self._pending_comps = comps
        # Render initial batch immediately for instant feedback
        self._render_chunk(0, 10)

    def _render_chunk(self, start_idx, chunk_size=10):
        total = len(self._pending_comps)
        end_idx = min(start_idx + chunk_size, total)
        for i in range(start_idx, end_idx):
            self._comp_row(i, self._pending_comps[i])

        if end_idx < total:
            self._render_job = self.after(5, lambda: self._render_chunk(end_idx, chunk_size))
        else:
            self._render_job = None

    def _comp_row(self, i, comp):
        source = comp.get("source", "user")

        v = tk.BooleanVar(value=True)
        self.check_vars[comp["name"]] = v

        row_color = {"bundled": "#141426", "user": "#16241a", "sheet": "#1b1428"}.get(source, "#16162a")
        # Flattened row structure: 40% less widget overhead for low-end laptops
        row = ctk.CTkFrame(self.comp_list, fg_color=row_color, corner_radius=8, height=62)
        row.grid(row=i, column=0, sticky="ew", pady=3, padx=2)
        row.grid_columnconfigure(1, weight=1)
        row.grid_propagate(False)

        def toggle_cb(event=None):
            v.set(not v.get())

        cb = ctk.CTkCheckBox(row, text="", variable=v,
                             width=22, height=22,
                             checkbox_width=18, checkbox_height=18,
                             fg_color="#2563eb", hover_color="#3b82f6",
                             border_color="#3b3b55")
        cb.grid(row=0, column=0, rowspan=2, padx=(12, 8), pady=16)

        # Tags string
        if comp.get("files"):
            tags = " ".join("[" + os.path.splitext(f)[1].upper().lstrip(".") + "]" for f in comp["files"])
        else:
            parts = []
            if comp.get("asy"): parts.append("[ASY]")
            if comp.get("lib"): parts.append("[LIB]")
            if comp.get("sub"): parts.append("[SUB]")
            tags = " ".join(parts) if parts else "[ONLINE]"

        cat_str = comp.get("category", "")
        cat_badge = f"  ({cat_str})" if self.sv.get().strip() else ""
        comp_name = comp["name"]
        lbl_name = ctk.CTkLabel(row, text=f"{comp_name}  {tags}{cat_badge}",
                                font=ctk.CTkFont(size=13, weight="bold"),
                                text_color="#f8fafc", anchor="w")
        lbl_name.grid(row=0, column=1, sticky="w", pady=(8, 0))

        # Description line
        desc_text = comp.get("desc") or "Standard semiconductor SPICE model"
        lbl_desc = ctk.CTkLabel(row, text=desc_text,
                                font=ctk.CTkFont(size=11),
                                text_color="#94a3b8", anchor="w")
        lbl_desc.grid(row=1, column=1, sticky="w", pady=(0, 8))

        # Code Inspector Button
        code_btn = ctk.CTkButton(row, text="👁 Code", width=62, height=26,
                                font=ctk.CTkFont(size=11, weight="bold"),
                                fg_color="#1e1e35", hover_color="#2d2d48",
                                border_width=1, border_color="#383858",
                                command=lambda c=comp: self._view_code_dialog(c))
        code_btn.grid(row=0, column=2, rowspan=2, padx=8, pady=16)

        # Badge: source credit
        if source == "bundled":
            badge_text = "Built-in"
            badge_color = "#38bdf8"
        elif source == "sheet":
            badge_text = "🌐 Online"
            badge_color = "#a78bfa"
        else:
            badge_text = "My Component"
            badge_color = "#10b981"

        badge_lbl = ctk.CTkLabel(row, text=badge_text,
                                 font=ctk.CTkFont(size=11, weight="bold"),
                                 text_color=badge_color, width=70, anchor="e")
        badge_lbl.grid(row=0, column=3, rowspan=2, padx=(0, 14), pady=16)

        row.bind("<Button-1>", toggle_cb)
        lbl_name.bind("<Button-1>", toggle_cb)
        lbl_desc.bind("<Button-1>", toggle_cb)

    def _toggle_all(self):
        all_on = all(v.get() for v in self.check_vars.values())
        for v in self.check_vars.values():
            v.set(not all_on)
        self.sel_btn.configure(text="Deselect All" if not all_on else "Select All")

    # ── SPICE Code & Details Inspector Modal ───────────────────────────────────

    def _view_code_dialog(self, comp):
        win = ctk.CTkToplevel(self)
        win.title(f"{comp['name']} — SPICE Model & Symbol Inspector")
        win.geometry("640x520")
        win.resizable(True, True)
        win.attributes("-topmost", True)
        win.grab_set()

        hdr_f = ctk.CTkFrame(win, fg_color="transparent")
        hdr_f.pack(fill="x", padx=18, pady=(16, 6))

        ctk.CTkLabel(hdr_f, text=f"Component: {comp['name']}",
                     font=ctk.CTkFont("Segoe UI", 16, "bold"), text_color="#5b9bf5").pack(anchor="w")

        desc = comp.get("desc") or "Standard semiconductor SPICE model"
        ctk.CTkLabel(hdr_f, text=f"Category: {comp['category']} • {desc}",
                     font=ctk.CTkFont(size=11), text_color="#94a3b8").pack(anchor="w")

        tabview = ctk.CTkTabview(win, fg_color="#0e0e1a", segmented_button_fg_color="#18182c",
                                 segmented_button_selected_color="#2563eb")
        tabview.pack(fill="both", expand=True, padx=16, pady=8)

        tab_model = tabview.add("SPICE Model (.lib / .sub)")
        tab_sym = tabview.add("Symbol Code (.asy)")

        tab_model.grid_columnconfigure(0, weight=1)
        tab_model.grid_rowconfigure(0, weight=1)
        tab_sym.grid_columnconfigure(0, weight=1)
        tab_sym.grid_rowconfigure(0, weight=1)

        # Read Model Code
        model_code = comp.get("lib") or comp.get("sub") or ""
        sym_code = comp.get("asy") or ""

        if comp.get("path"):
            for f in comp.get("files", []):
                fp = os.path.join(comp["path"], f)
                ext = os.path.splitext(f)[1].lower()
                try:
                    if ext in [".lib", ".sub", ".mod", ".cir"]:
                        with open(fp, "r", encoding="utf-8", errors="ignore") as rf:
                            model_code = rf.read()
                    elif ext == ".asy":
                        with open(fp, "r", encoding="utf-8", errors="ignore") as rf:
                            sym_code = rf.read()
                except Exception:
                    pass

        tb_m = ctk.CTkTextbox(tab_model, font=ctk.CTkFont(family="Consolas", size=11),
                              fg_color="#070712", text_color="#93c5fd", wrap="none")
        tb_m.grid(row=0, column=0, sticky="nsew", padx=6, pady=6)
        tb_m.insert("end", model_code or "* No separate library file; defined via standard model.")
        tb_m.configure(state="disabled")

        tb_s = ctk.CTkTextbox(tab_sym, font=ctk.CTkFont(family="Consolas", size=11),
                              fg_color="#070712", text_color="#a7f3d0", wrap="none")
        tb_s.grid(row=0, column=0, sticky="nsew", padx=6, pady=6)
        tb_s.insert("end", sym_code or "* Symbol code not available locally.")
        tb_s.configure(state="disabled")

        btn_f = ctk.CTkFrame(win, fg_color="transparent")
        btn_f.pack(fill="x", padx=16, pady=(0, 14))

        def copy_spice():
            self.clipboard_clear()
            self.clipboard_append(model_code or sym_code)
            copy_btn.configure(text="Copied to Clipboard!", fg_color="#10b981")
            win.after(1500, lambda: copy_btn.configure(text="📋 Copy SPICE Code", fg_color="#2563eb"))

        copy_btn = ctk.CTkButton(btn_f, text="📋 Copy SPICE Code", height=32, font=ctk.CTkFont(size=12, weight="bold"),
                                 fg_color="#2563eb", hover_color="#1d4ed8", command=copy_spice)
        copy_btn.pack(side="left", padx=(0, 10))

        ctk.CTkButton(btn_f, text="Close", width=90, height=32, font=ctk.CTkFont(size=12),
                      fg_color="#334155", hover_color="#475569", command=win.destroy).pack(side="right")

    # ── Database Sync Dialog ───────────────────────────────────────────────────

    def _sync_databases_dialog(self):
        if not self.ltspice_path:
            messagebox.showerror("Error", "Please configure or auto-detect your LTspice folder first.")
            return

        cnt, logs = sync_standard_cmp_databases(self.ltspice_path)
        win = ctk.CTkToplevel(self)
        win.title("Native Database Synchronization")
        win.geometry("540x360")
        win.grab_set()

        ctk.CTkLabel(win, text="✔ LTspice Database Sync Completed",
                     font=ctk.CTkFont("Segoe UI", 15, "bold"), text_color="#10b981").pack(pady=(18, 4), padx=20, anchor="w")

        ctk.CTkLabel(win, text=f"Integrated {cnt} models into standard.dio, standard.bjt, standard.jft, standard.mos.",
                     font=ctk.CTkFont(size=11), text_color="#94a3b8").pack(padx=20, anchor="w")

        tb = ctk.CTkTextbox(win, font=ctk.CTkFont(family="Consolas", size=11),
                            fg_color="#090911", text_color="#a7f3d0", wrap="none")
        tb.pack(fill="both", expand=True, padx=16, pady=12)

        if logs:
            for l in logs:
                tb.insert("end", l + "\n")
        else:
            tb.insert("end", "All standard component databases are already up to date!\n")
        tb.configure(state="disabled")

        ctk.CTkButton(win, text="Close", height=34, fg_color="#2563eb", hover_color="#1d4ed8",
                      command=win.destroy).pack(pady=(0, 14), padx=16, fill="x")

        self.status.set("LTspice native component databases synced successfully.")

    # ── Feedback Dialog ────────────────────────────────────────────────────────

    def _feedback_dialog(self):
        win = ctk.CTkToplevel(self)
        win.title("Submit Feedback")
        win.geometry("400x320")
        win.resizable(False, False)
        win.attributes("-topmost", True)
        win.grab_set()

        ctk.CTkLabel(win, text="Your Name:", font=ctk.CTkFont(weight="bold", size=12)).pack(pady=(15, 0), padx=20, anchor="w")
        name_v = tk.StringVar()
        ctk.CTkEntry(win, textvariable=name_v, height=32, fg_color="#1e1e30", border_color="#2e2e4a").pack(fill="x", padx=20, pady=(5, 10))

        ctk.CTkLabel(win, text="Message / Request:", font=ctk.CTkFont(weight="bold", size=12)).pack(pady=(5, 0), padx=20, anchor="w")
        msg_tb = ctk.CTkTextbox(win, height=100, fg_color="#1e1e30", border_color="#2e2e4a", border_width=1)
        msg_tb.pack(fill="x", padx=20, pady=(5, 15))

        def submit():
            name = name_v.get().strip()
            msg = msg_tb.get("1.0", "end").strip()
            if not msg:
                messagebox.showwarning("Warning", "Message cannot be empty.")
                return

            btn.configure(text="⏳ Sending...", state="disabled")
            def send():
                try:
                    data = json.dumps({"name": name, "feedback": msg}).encode('utf-8')
                    req = urllib.request.Request(APPS_SCRIPT_URL, data=data, headers={'Content-Type': 'application/json'}, method='POST')
                    with urllib.request.urlopen(req, timeout=8):
                        pass
                    self.after(0, lambda: messagebox.showinfo("Success", "Feedback sent successfully!"))
                    self.after(0, win.destroy)
                except Exception:
                    self.after(0, lambda: messagebox.showerror("Error", "Failed to send feedback. Check your internet connection."))
                    self.after(0, lambda: btn.configure(text="Submit Feedback", state="normal"))
            threading.Thread(target=send, daemon=True).start()

        btn = ctk.CTkButton(win, text="Submit Feedback", command=submit, height=36, fg_color="#10b981", hover_color="#059669", font=ctk.CTkFont(weight="bold"))
        btn.pack(pady=(0, 10), padx=20, fill="x")

    # ── Installation Execution ─────────────────────────────────────────────────

    def _install_all_components(self):
        """Install all components across all categories in one click."""
        if not self.ltspice_path:
            messagebox.showerror("Setup Folder Path", "Please select or auto-detect your LTspice install folder first.")
            return

        all_comps = []
        for cat_list in self.categories.values():
            all_comps.extend(cat_list)

        self._execute_install(all_comps)

    def _install(self):
        if not self.ltspice_path:
            messagebox.showerror("Setup Folder Path",
                                 "LTspice install folder is not configured. Please browse and select it first.")
            return

        cat = self.active_cat.get()
        all_c = self.categories.get(cat, [])
        sel = [c for c in all_c if self.check_vars.get(c["name"], tk.BooleanVar()).get()]

        if not sel:
            self.status.set("⚠ Select components to install first.")
            return

        self._execute_install(sel)

    def _execute_install(self, comp_list):
        self.inst_btn.configure(state="disabled", text="Installing...")
        self.status.set("Copying and verifying components into LTspice...")
        self.pbar.set(0)

        def progress_cb(pct):
            self.after(0, lambda: self.pbar.set(pct))

        def run():
            ready = []
            for comp in comp_list:
                if comp.get("source") == "sheet" and not comp.get("files"):
                    cat_dir = os.path.join(USER_MODELS, comp["category"])
                    os.makedirs(cat_dir, exist_ok=True)
                    new_files = []
                    if comp.get("asy"):
                        p = os.path.join(cat_dir, comp["name"] + ".asy")
                        with open(p, "w", encoding="utf-8") as f: f.write(comp["asy"])
                        new_files.append(comp["name"] + ".asy")
                    if comp.get("lib"):
                        p = os.path.join(cat_dir, comp["name"] + ".lib")
                        with open(p, "w", encoding="utf-8") as f: f.write(comp["lib"])
                        new_files.append(comp["name"] + ".lib")
                    if comp.get("sub"):
                        p = os.path.join(cat_dir, comp["name"] + ".sub")
                        with open(p, "w", encoding="utf-8") as f: f.write(comp["sub"])
                        new_files.append(comp["name"] + ".sub")
                    ready.append({"name": comp["name"], "category": comp["category"],
                                  "files": new_files, "path": cat_dir, "desc": comp.get("desc", "")})
                else:
                    ready.append(comp)

            ok, errs, log = install_components_verified(ready, self.ltspice_path, progress_cb)
            self.after(0, lambda: self._install_done(ok, errs, log))

        threading.Thread(target=run, daemon=True).start()

    def _install_done(self, ok, errs, log):
        self.inst_btn.configure(state="normal", text="Install Selected  →")
        self.pbar.set(1.0)

        win = ctk.CTkToplevel(self)
        win.title("Installation & Verification Report")
        win.geometry("580x440")
        win.resizable(False, False)
        win.grab_set()
        win.focus_set()

        title_color = "#10b981" if not errs else "#f59e0b"
        title_text = f"✔ Verified: {ok} Files Installed & Synced!" if not errs \
            else f"⚠ Installed {ok} files, {len(errs)} failures detected"

        ctk.CTkLabel(win, text=title_text,
                     font=ctk.CTkFont("Segoe UI", 15, "bold"),
                     text_color=title_color).pack(pady=(20, 4), padx=20, anchor="w")

        ctk.CTkLabel(win, text="All symbol (.asy) and model (.lib) files placed in correct directories.",
                     font=ctk.CTkFont(size=11), text_color="#64748b").pack(padx=20, anchor="w")

        tb = ctk.CTkTextbox(win, font=ctk.CTkFont(family="Consolas", size=11),
                            fg_color="#090911", text_color="#a7f3d0" if not errs else "#fed7aa",
                            wrap="none", corner_radius=8)
        tb.pack(fill="both", expand=True, padx=16, pady=12)

        for line in log:
            tb.insert("end", line + "\n")
        tb.configure(state="disabled")

        ctk.CTkButton(win, text="Done & Ready to Simulate", height=38,
                      fg_color="#10b981" if not errs else "#3b82f6",
                      hover_color="#059669" if not errs else "#2563eb",
                      command=win.destroy).pack(pady=(0, 16), padx=16, fill="x")

        self.status.set(f"Successfully verified {ok} files installed.")

    # ── Advanced Paste / Add Component Dialog ──────────────────────────────────

    def _add_dialog(self):
        win = ctk.CTkToplevel(self)
        win.title("Add Component Wizard (AI Paste Support)")
        win.geometry("680x780")
        win.resizable(False, False)
        win.grab_set()
        win.focus_set()

        ctk.CTkLabel(win, text="＋  Add Component Wizard",
                     font=ctk.CTkFont("Segoe UI", 16, "bold"),
                     text_color="#5b9bf5").pack(pady=(18, 2), padx=20, anchor="w")

        ctk.CTkLabel(win, text="Enter details to dynamically create or paste symbol and model code.",
                     font=ctk.CTkFont(size=11), text_color="#64748b").pack(padx=20, anchor="w")

        # 1. Name Entry Row
        nf = ctk.CTkFrame(win, fg_color="transparent")
        nf.pack(fill="x", padx=20, pady=(12, 0))
        ctk.CTkLabel(nf, text="Component Name (must match your SPICE file name)", font=ctk.CTkFont(size=12, weight="bold"),
                     text_color="#93c5fd").pack(anchor="w")
        name_v = tk.StringVar()
        ctk.CTkEntry(nf, textvariable=name_v, height=36,
                     placeholder_text="e.g. 1N34A, SL100, BFW10, LM741, 74LS04",
                     font=ctk.CTkFont(size=13),
                     fg_color="#1e1e30", border_color="#2e2e4a").pack(fill="x", pady=(4, 0))

        # 2. Category Selection Row
        cf = ctk.CTkFrame(win, fg_color="transparent")
        cf.pack(fill="x", padx=20, pady=(10, 0))
        ctk.CTkLabel(cf, text="Save to Category Folder", font=ctk.CTkFont(size=12, weight="bold"),
                     text_color="#93c5fd").pack(anchor="w")

        cats = list(self.categories.keys())
        cat_v = tk.StringVar(value=cats[0] if cats else "Diodes")

        combo = ctk.CTkComboBox(cf, values=cats + ["＋ Create New Category…"],
                                variable=cat_v, height=36,
                                font=ctk.CTkFont(size=13),
                                fg_color="#1e1e30", border_color="#2e2e4a")
        combo.pack(fill="x", pady=(4, 0))

        new_cat_v = tk.StringVar()
        new_cat_e = ctk.CTkEntry(cf, textvariable=new_cat_v, height=34,
                                 placeholder_text="Enter new category folder name",
                                 font=ctk.CTkFont(size=12),
                                 fg_color="#1e1e30", border_color="#2e2e4a")

        def on_cat_toggle(val):
            if val == "＋ Create New Category…":
                new_cat_e.pack(fill="x", pady=(6, 0))
            else:
                new_cat_e.pack_forget()

        combo.configure(command=on_cat_toggle)

        # 3. Tab Options: Upload File vs Dual Paste AI Code
        tab = ctk.CTkTabview(win, height=340,
                             fg_color="#111122", segmented_button_fg_color="#1e1e30",
                             segmented_button_selected_color="#2563eb",
                             segmented_button_unselected_color="#1e1e30")
        tab.pack(fill="both", expand=True, padx=20, pady=(12, 0))

        tab.add("📋  Paste Code from AI")
        tab.add("📂  Upload Local Files")

        # Tab: Upload Local Files
        up = tab.tab("📂  Upload Local Files")
        up.grid_columnconfigure(0, weight=1)

        chosen_files: list[str] = []
        files_lbl = ctk.CTkLabel(up, text="No files chosen. Select symbol (.asy) or subcircuit (.lib/.sub/.mod/.cir) files.",
                                 font=ctk.CTkFont(size=11), text_color="#64748b", justify="left", wraplength=520)
        files_lbl.grid(row=0, column=0, sticky="w", pady=(15, 10), padx=8)

        def pick():
            paths = filedialog.askopenfilenames(
                title="Select symbol (.asy) or model (.lib/.sub) files",
                filetypes=[("LTspice components", "*.asy *.lib *.sub *.mod *.cir"),
                           ("All files", "*.*")],
                parent=win)
            if paths:
                chosen_files.clear()
                chosen_files.extend(paths)
                names = "Selected files to install:\n" + "\n".join(f"• {os.path.basename(p)}" for p in paths)
                files_lbl.configure(text=names, text_color="#38bdf8")

        ctk.CTkButton(up, text="Browse and Choose Files", height=38,
                      font=ctk.CTkFont(size=12, weight="bold"),
                      fg_color="#1e2a4a", hover_color="#263560",
                      border_width=1, border_color="#3b4a7a",
                      command=pick).grid(row=1, column=0, sticky="ew", padx=8, pady=5)

        # Tab: Paste AI Code (Visual split into Symbol and Behavior)
        pc = tab.tab("📋  Paste Code from AI")
        pc.grid_columnconfigure(0, weight=1)

        lbl_frame = ctk.CTkFrame(pc, fg_color="transparent")
        lbl_frame.grid(row=0, column=0, columnspan=2, sticky="ew", padx=6, pady=(4, 2))
        lbl_frame.grid_columnconfigure(0, weight=1)
        lbl_frame.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(lbl_frame, text="1. Symbol Code (.asy)", font=ctk.CTkFont(size=11, weight="bold"),
                     text_color="#facc15").grid(row=0, column=0, sticky="w")

        ctk.CTkLabel(lbl_frame, text="2. Model Code (.lib / .sub)", font=ctk.CTkFont(size=11, weight="bold"),
                     text_color="#facc15").grid(row=0, column=1, sticky="e")

        sym_box = ctk.CTkTextbox(pc, font=ctk.CTkFont(family="Consolas", size=10),
                                 fg_color="#090911", text_color="#a0c0ff",
                                 wrap="none", corner_radius=6)
        sym_box.grid(row=1, column=0, sticky="nsew", padx=4, pady=4)
        sym_box.insert("end", "Version 4\nSymbolType CELL\nLINE Normal 0 0 32 32\n* Paste .asy code here...")

        mod_box = ctk.CTkTextbox(pc, font=ctk.CTkFont(family="Consolas", size=10),
                                 fg_color="#090911", text_color="#a0c0ff",
                                 wrap="none", corner_radius=6)
        mod_box.grid(row=1, column=1, sticky="nsew", padx=4, pady=4)
        mod_box.insert("end", "* SPICE Subcircuit / Model Definition\n.SUBCKT MyComponent 1 2 3\n* Paste .lib code here...\n.ENDS")

        # 4. Status Indicator & Save Command Button
        st_lbl = ctk.CTkLabel(win, text="", font=ctk.CTkFont(size=12), text_color="#94a3b8")
        st_lbl.pack(pady=(8, 0), padx=20, anchor="w")

        def do_add():
            comp_name = name_v.get().strip()
            chosen_cat = cat_v.get().strip()

            if chosen_cat == "＋ Create New Category…":
                chosen_cat = new_cat_v.get().strip()

            if not comp_name:
                st_lbl.configure(text="⚠ Component name is required.", text_color="#f87171")
                return
            if not chosen_cat:
                st_lbl.configure(text="⚠ Category folder name is required.", text_color="#f87171")
                return

            dest_cat_dir = os.path.join(USER_MODELS, chosen_cat)
            os.makedirs(dest_cat_dir, exist_ok=True)
            saved = []

            active_tab = tab.get()
            if "Upload" in active_tab:
                if not chosen_files:
                    st_lbl.configure(text="⚠ Please choose files to upload.", text_color="#f87171")
                    return
                for src in chosen_files:
                    dst = os.path.join(dest_cat_dir, os.path.basename(src))
                    shutil.copy2(src, dst)
                    saved.append(dst)
            else:
                sym_code = sym_box.get("1.0", "end").strip()
                mod_code = mod_box.get("1.0", "end").strip()

                has_sym = sym_code and not sym_code.startswith("Version 4\nSymbolType CELL\nLINE Normal 0 0 32 32\n* Paste")
                has_mod = mod_code and not mod_code.startswith("* SPICE Subcircuit")

                if not has_sym and not has_mod:
                    st_lbl.configure(text="⚠ Paste code into at least one of the editor boxes.", text_color="#f87171")
                    return

                if has_sym:
                    sym_dst = os.path.join(dest_cat_dir, f"{comp_name}.asy")
                    with open(sym_dst, "w", encoding="utf-8") as f:
                        f.write(sym_code)
                    saved.append(sym_dst)

                if has_mod:
                    mod_dst = os.path.join(dest_cat_dir, f"{comp_name}.lib")
                    with open(mod_dst, "w", encoding="utf-8") as f:
                        f.write(mod_code)
                    saved.append(mod_dst)

            inst_count = 0
            if self.ltspice_path:
                for fpath in saved:
                    ext = os.path.splitext(fpath)[1].lower()
                    sub_dir = EXT_MAP.get(ext, "sub")
                    lt_dir = os.path.join(self.ltspice_path, "lib", sub_dir, chosen_cat)
                    os.makedirs(lt_dir, exist_ok=True)
                    shutil.copy2(fpath, os.path.join(lt_dir, os.path.basename(fpath)))
                    inst_count += 1
                    if sub_dir == "sub":
                        lt_global = os.path.join(self.ltspice_path, "lib", "sub")
                        shutil.copy2(fpath, os.path.join(lt_global, os.path.basename(fpath)))

            self.categories = scan_categories()
            self._populate_categories()
            self._select_cat(chosen_cat)

            msg = f"✔ Component '{comp_name}' saved."
            if inst_count:
                msg += f" Installed {inst_count} file(s) into LTspice!"
            st_lbl.configure(text=msg, text_color="#10b981")

            _asy = _lib = _sub = ""
            if "Upload" not in tab.get():
                _asy = sym_code if has_sym else ""
                _lib = mod_code if has_mod else ""
            else:
                for fpath in saved:
                    ext = os.path.splitext(fpath)[1].lower()
                    try:
                        with open(fpath, "r", encoding="utf-8", errors="ignore") as rf:
                            content = rf.read()
                        if ext == ".asy":   _asy = content
                        elif ext == ".lib": _lib = content
                        elif ext == ".sub": _sub = content
                    except Exception:
                        pass

            upload_btn_ref = [None]

            def do_upload_online():
                upload_btn_ref[0].configure(text="⏳ Uploading...", state="disabled")
                def _bg():
                    if is_online():
                        upload_component_to_sheet(comp_name, chosen_cat, _asy, _lib, _sub)
                        win.after(0, lambda: upload_btn_ref[0].configure(
                            text="✅ Uploaded!", state="disabled", fg_color="#10b981"))
                    else:
                        win.after(0, lambda: upload_btn_ref[0].configure(
                            text="❌ No Internet", state="normal", fg_color="#ef4444"))
                threading.Thread(target=_bg, daemon=True).start()

            upload_btn = ctk.CTkButton(win, text="🌐 Upload to Online Library",
                          height=38, font=ctk.CTkFont(size=13, weight="bold"),
                          fg_color="#7c3aed", hover_color="#6d28d9",
                          command=do_upload_online)
            upload_btn.pack(fill="x", padx=20, pady=(4, 20))
            upload_btn_ref[0] = upload_btn

        ctk.CTkButton(win, text="➕ Submit & Add Component to LTspice",
                      height=46, font=ctk.CTkFont(size=14, weight="bold"),
                      fg_color="#2563eb", hover_color="#1d4ed8",
                      command=do_add).pack(fill="x", padx=20, pady=(10, 6))

    # ── Directory Explorer Browser Picker & Auto Detect ────────────────────────

    def _auto_detect(self):
        detected = detect_ltspice()
        if detected:
            self.ltspice_path = detected
            self.cfg["ltspice_path"] = detected
            save_cfg(self.cfg)
            self.path_lbl.configure(text=self._short(detected), text_color="#38bdf8")
            self.status.set(f"LTspice auto-detected: {detected}")
            messagebox.showinfo("Auto Detect Success", f"Found LTspice at:\n{detected}")
        else:
            messagebox.showwarning("Auto Detect", "LTspice not found in standard directories.\nPlease use Browse to select folder manually.")

    def _browse(self):
        p = filedialog.askdirectory(title="Browse and select local LTspice root directory", parent=self)
        if p:
            self.ltspice_path = p
            self.cfg["ltspice_path"] = p
            save_cfg(self.cfg)
            self.path_lbl.configure(text=self._short(p), text_color="#38bdf8")
            self.status.set(f"LTspice install folder location saved: {p}")

    @staticmethod
    def _short(p, n=32):
        if not p: return ""
        if len(p) <= n: return p
        parts = p.replace("\\", "/").split("/")
        return "…/" + "/".join(parts[-2:])


# ── Auto Shortcut Creator ─────────────────────────────────────────────────────

def create_desktop_shortcut():
    if not getattr(sys, "frozen", False):
        return

    import tempfile
    import subprocess

    desktop = os.path.join(os.environ.get("USERPROFILE", os.path.expanduser("~")), "Desktop")
    shortcut_path = os.path.join(desktop, "LTspice Component Adder Pro.lnk")

    if os.path.exists(shortcut_path):
        return

    target_path = sys.executable
    vbs_content = f"""
Set oWS = WScript.CreateObject("WScript.Shell")
Set oLink = oWS.CreateShortcut("{shortcut_path}")
oLink.TargetPath = "{target_path}"
oLink.Description = "LTspice Component Adder Pro"
oLink.IconLocation = "{target_path}, 0"
oLink.Save
"""
    vbs_path = os.path.join(tempfile.gettempdir(), "create_shortcut.vbs")
    try:
        with open(vbs_path, "w") as f:
            f.write(vbs_content)
        subprocess.run(["cscript", "//nologo", vbs_path], creationflags=subprocess.CREATE_NO_WINDOW)
        os.remove(vbs_path)
    except Exception:
        pass


# ── Run Main Window ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    create_desktop_shortcut()
    App().mainloop()
