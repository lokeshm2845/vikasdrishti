# VikasDrishti - "Red Light" Phase Execution Guide (iQOO Office Kit)

During the **Red Light** phase of the iQOO Hackathon 2026, development is restricted strictly to the **iQOO 15 phone** using the **iQOO Office Kit** without laptop access.

This guide provides the complete workflow to edit, build, test, and present VikasDrishti directly on the phone.

---

## 🛠️ 1. Phone Environment & Tools Setup

### Installed Apps on iQOO 15:
1. **Termux:** Terminal emulator for Linux environment & Node.js server execution.
2. **AIDE / Code App / VS Code Web (code-server):** IDE for live code editing on phone screen.
3. **iQOO Office Kit:** Keyboard, Mouse & Smart Screen Casting interface.
4. **Kiwi Browser / Chrome:** PWA debugging and local web testing.

---

## 🚀 2. Step-by-Step Red Light Setup Instructions

### Step 1: Open Termux & Grant Storage Permissions
```bash
termux-setup-storage
```

### Step 2: Run Setup Script
```bash
chmod +x scripts/termux_setup.sh
./scripts/termux_setup.sh
```

### Step 3: Launch Local Node Server on iQOO 15
```bash
cd frontend
npm start
```
The React development server will start on `http://localhost:3000`.

---

## 📱 3. Phone-First Code Editing & Feature Verification

### Editing Files on Device:
- Use **Termux Micro/Nano Editor** or **VS Code Web (`code-server`)** running on port 8080:
```bash
npx code-server --auth none --port 8080
```
- Open `http://localhost:8080` in the browser to get full VS Code on your iQOO 15!

### Testing On-Device Capabilities:
- **Offline Complaint Submission:** Turn on Airplane Mode. Open `http://localhost:3000/user/raise-complaint`. Submit a complaint with voice input and 50MP photo. Verify it stores instantly into local IndexedDB.
- **TFLite Categorization:** Type *"Drainage overflowing in front of market"* into the complaint box. Observe the blue badge verifying categorization in `<50ms`.
- **Background Sync:** Turn off Airplane Mode. Observe the top bar transition to *"🌐 Online • Supabase Sync Active"* and automatically upload queued complaints.

---

## 📊 4. Red Light Verification Checklist

- [x] Node.js & React App running smoothly on Snapdragon 8 Gen 3 inside Termux.
- [x] Local IndexedDB storing complaints offline.
- [x] Voice Recognition & Bhashini translation operating without internet connection.
- [x] High-precision GPS & 50MP Camera image processing working natively on phone.
- [x] Zero cloud dependency during offline test runs.
