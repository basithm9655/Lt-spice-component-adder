@echo off
setlocal EnableDelayedExpansion
title LTspice Component Adder — Builder. Built by Basi 
color 0B

echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║    LTspice Component Adder  —  EXE Builder       ║
echo  ║    Built by Basi                                 ║
echo  ╚══════════════════════════════════════════════════╝
echo.

:: ── Check Python ─────────────────────────────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo  [WARNING] Python is not installed!
    echo  [..] Automatically downloading Python 3.11...
    curl -# -o python_installer.exe https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe
    
    if not exist python_installer.exe (
        echo  [ERROR] Failed to download Python. Please install from python.org
        pause & exit /b 1
    )
    
    echo  [..] Installing Python silently ^(this may take a minute^)...
    start /wait python_installer.exe /quiet InstallAllUsers=0 PrependPath=1 Include_test=0
    del python_installer.exe
    
    :: Update PATH for the current terminal session so we don't have to restart
    set "PATH=%LocalAppData%\Programs\Python\Python311;%LocalAppData%\Programs\Python\Python311\Scripts;%PATH%"
    
    python --version >nul 2>&1
    if errorlevel 1 (
        echo.
        echo  [OK] Python installed successfully!
        echo  [!] IMPORTANT: Please close this black window and double-click build.bat AGAIN.
        pause & exit /b 0
    )
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo  [OK] %%v

:: ── Install deps ──────────────────────────────────────────────────────────────
echo  [..] Installing packages (customtkinter, pyinstaller, pillow, requests)...
pip install customtkinter pyinstaller pillow requests --upgrade --quiet
if errorlevel 1 ( echo  [ERROR] pip failed. & pause & exit /b 1 )
echo  [OK] Packages ready.

:: ── Clean ─────────────────────────────────────────────────────────────────────
if exist "dist"  rmdir /s /q "dist"
if exist "build" rmdir /s /q "build"
if exist "*.spec" del /q "*.spec"
echo  [OK] Cleaned previous build artifacts.

:: ── Build single-file EXE ─────────────────────────────────────────────────────
echo  [..] Building single-file EXE...
echo       (Takes ~45 seconds — do not close this window)
echo.

pyinstaller ^
  --name "ltspice component adder - by Basi" ^
  --windowed ^
  --onefile ^
  --noconfirm ^
  --clean ^
  --icon=icon.ico ^
  --add-data "icon.ico;." ^
  --add-data "Lt-Spice-models-main;Lt-Spice-models-main" ^
  --collect-all customtkinter ^
  --hidden-import PIL ^
  --hidden-import PIL._imagingtk ^
  --hidden-import tkinter ^
  --hidden-import tkinter.ttk ^
  app.py

if errorlevel 1 (
    echo.
    echo  [ERROR] Build failed! See output above for details.
    pause & exit /b 1
)

:: ── Cleanup spec/build ────────────────────────────────────────────────────────
if exist "build" rmdir /s /q "build"
if exist "*.spec" del /q "*.spec"

:: ── Done ──────────────────────────────────────────────────────────────────────
echo.
echo  ╔══════════════════════════════════════════════════╗
echo  ║   ✔  BUILD SUCCESSFUL!                           ║
echo  ╠══════════════════════════════════════════════════╣
echo  ║   Single EXE:  dist\ltspice component adder - by Basi.exe  ║
echo  ║                                                  ║
echo  ║   NOTE: A "MyComponents" folder will be created  ║
echo  ║   next to the EXE when you add new components.   ║
echo  ╚══════════════════════════════════════════════════╝
echo.

explorer "dist"
pause
