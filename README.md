# 🏛️ VikasDrishti — Hyper-Local Governance Platform

> **AI-Powered, Real-Time, Geofenced Governance Platform Connecting Citizens with Elected Representatives for Transparent Ward & Gali Development.**

![VikasDrishti Banner](https://img.shields.io/badge/Platform-VikasDrishti-orange?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_19_%7C_Supabase_%7C_Leaflet-blue?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge)
![Hardware](https://img.shields.io/badge/Device-iQOO_15_AI--Native-green?style=for-the-badge)

---

## 📌 About the Project

**VikasDrishti** is a state-of-the-art hyper-local governance web application designed to bridge the gap between citizens and their elected representatives (MLAs, Councilors, Mayors). Built with a mobile-first, AI-native architecture, it empowers citizens to report civic grievances (potholes, streetlight failures, drainage issues) with automated on-device AI categorization, visual photo proof, and spatial GIS geofencing.

### 🌟 Key Innovation & Features

- 👤 **Dual Role Architecture:** Distinct, secure, dynamic portals for **Citizens** and **Elected Representatives / MLAs**.
- 📍 **Spatial GIS Geofencing:** Interactive Leaflet OpenStreetMap canvas allowing leaders to draw ward/gali boundaries, query resident demographics inside polygon boundaries, and broadcast geofenced SMS notifications.
- ⚡ **Real-Time Supabase Synchronization:** Live PostgreSQL real-time listeners update citizen and leader dashboards instantaneously upon grievance submission or status change.
- 🤖 **On-Device AI Classification:** Snapdragon 8 Gen 3 TFLite text classifier automatically categorizes complaints in under `<50ms` even offline.
- 🌐 **Multilingual Accessibility:** Integrated Bhashini AI engine supporting English, Hindi, Marathi, and Gujarati translations.
- 📱 **Offline-First Resilience:** IndexedDB local storage engine ensuring zero data loss during network disruptions.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React.js 19, React Router DOM v7, Vanilla CSS (Glassmorphism), Lucide & FontAwesome Icons |
| **Backend & DB** | Supabase (PostgreSQL, PostGIS Extension, Supabase Auth, Realtime Engine) |
| **Mapping & GIS** | Leaflet.js, React Leaflet, OpenStreetMap Tile API |
| **Notifications** | Twilio SMS API, Toast Notifications |
| **AI / ML** | On-Device TFLite Text Classifier, Bhashini Translation API |
| **Hosting & CI/CD** | Vercel / Netlify |

---

## 📁 Project Structure

```text
VikasDrishti/
├── frontend/                  # React Application Source
│   ├── public/                # HTML Templates, Icons & Manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Login & Registration Components
│   │   │   ├── common/        # Navbar, Footer, Profile, Loaders
│   │   │   ├── leader/        # Leader Dashboard, GeofenceMap, Complaints
│   │   │   ├── pages/         # Home, About, Contact, FAQ, HowItWorks
│   │   │   └── user/          # Citizen Dashboard, RaiseComplaint, MyComplaints
│   │   ├── context/           # AuthContext (Dynamic Role Resolution)
│   │   ├── services/          # Supabase, Offline Storage, TFLite AI
│   │   └── App.js             # Route Configurations & Protected Routes
│   ├── package.json
│   ├── vercel.json            # Frontend Vercel Route Configuration
│   └── .env.example
├── docs/                      # Database Schemas & Documentation
├── scripts/                   # Migration Helper Scripts
├── vercel.json                # Root Vercel SPA Rewrite Rules
├── .gitignore                 # Environment & Build Ignore Rules
└── README.md                  # Project Documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js (v18.0 or higher)
- npm (v9.0 or higher)

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/lokeshm2845/VikasDrishti.git
   cd VikasDrishti/frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside `frontend/`:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch Local Development Server:**
   ```bash
   node node_modules\react-scripts\bin\react-scripts.js start
   ```
   Open **`http://localhost:3000`** in your browser.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Log in to **[Vercel](https://vercel.com)** and click **Add New Project**.
3. Import your **VikasDrishti** repository.
4. Set **Root Directory** as `frontend`.
5. Add Environment Variables: `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`.
6. Click **Deploy**!

---

## 👨‍💻 Developer & Author

- **Lead Developer:** Lokesh Magare
- **Team Name:** Vertex Victors
- **Address:** Shirpur, Dist. Dhule, Maharashtra, 425405
- **Phone:** [+91 9834260897](tel:+919834260897)
- **Email:** [lokeshmagare866@gmail.com](mailto:lokeshmagare866@gmail.com)
- **GitHub:** [github.com/lokeshm2845](https://github.com/lokeshm2845)
- **LinkedIn:** [linkedin.com/in/lokeshmagare289](https://www.linkedin.com/in/lokeshmagare289/)

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
