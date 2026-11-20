 How to Compile into a SINGLE-FILE EXE on Windows
The build.bat file has been fully configured to compile everything into a single, standalone file containing all assets in one go.

Copy your Ltspice component adder folder to your Windows PC.
Double-click build.bat. It will automatically:
Ensure Python is installed.
Install or update dependencies (customtkinter, pyinstaller, pillow).
Clean up previous temporary build files.
Build a single, standalone EXE using PyInstaller --onefile.
Open your folder explorer window pointing directly to the compiled executable.
Open dist\ and run LTspice Component Adder.exe!
📂 File Structure Cleaned & Verified
All junk files and local cache files have been deleted, leaving you with a perfectly pristine repository structure:

app.py — The complete code logic and gorgeous responsive UI.
build.bat — Automatic single-file EXE compiler script.
README.md — Step-by-step operating guidelines.
Lt-Spice-models-main/ — Pre-loaded components library folder.