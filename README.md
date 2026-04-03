# 🏥 HealthFlow — AI Health Companion

> **Its-A-Hack 2.0 — Team Devora**

A next-generation, AI-powered clinical management dashboard designed to streamline patient care workflows, surface intelligent health insights, and empower healthcare professionals with real-time diagnostics. Built for the **Its-A-Hack 2.0** hackathon.

---

## ✨ Features

| Module | Description |
|---|---|
| **📊 Dashboard** | System overview with quick-access navigation cards to every module |
| **🧠 AI Insights** | AI-synthesized executive summaries, condition detection, risk markers, and confidence scores |
| **✅ Daily Actions** | Clinically prioritized task manager with streak tracking and filter tabs |
| **📁 Upload Records** | Drag-and-drop document ingestion with simulated AI extraction and FHIR sync |
| **📅 Medical Timeline** | Visual patient journey tracker with milestone cards, documents, and action checklists |
| **🔔 Health Alerts** | Priority notifications with severity filters (Critical / Warning / Info) and dismiss/snooze |
| **👨‍👩‍👧 Family & Caregivers** | Caregiver access management, emergency bypass toggle, and member invitation flow |
| **🔐 Profile & Security** | Medical info, AES-256 encryption status, access logs, 2FA toggle, and session controls |

### 🔧 Technical Mode
Toggle between **Simple** and **Technical** views via the header switch.  
In Technical mode, a slide-in **Diagnostics Panel** reveals live system metrics:
- API Latency
- FHIR Sync Status
- Active Sessions
- Encryption Protocol
- System Load

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (Vite) |
| **Styling** | Tailwind CSS 3.4 with custom design tokens |
| **Routing** | React Router DOM v7 |
| **Notifications** | react-hot-toast |
| **Icons** | Google Material Symbols (Outlined) |
| **Fonts** | Inter, Manrope (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Hetal-Jain-1405/Its-A--Hack-2.0---Devora.git
cd Its-A--Hack-2.0---Devora

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be running at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
src/
├── App.jsx              # Route definitions
├── Layout.jsx           # Persistent sidebar, header, diagnostics panel
├── index.css            # Tailwind directives & custom design tokens
└── pages/
    ├── Dashboard.jsx    # System overview
    ├── AIInsights.jsx   # AI analytics & risk assessment
    ├── DailyActions.jsx # Task management
    ├── UploadRecords.jsx# Document ingestion
    ├── Timeline.jsx     # Medical journey tracker
    ├── Alerts.jsx       # Health notifications
    ├── Family.jsx       # Caregiver access control
    └── Profile.jsx      # Security & account settings
```

---

## 🎨 Design System

The UI is built on a custom Material Design 3-inspired token system:

- **Colors**: Primary (`#0C3B5E`), Secondary, Tertiary, Error, Surface layers
- **Typography**: Inter (body), Manrope (display)
- **Shapes**: Rounded corners (`0.75rem` — `2rem`)
- **Surfaces**: Layered elevation system (`surface-container-lowest` → `surface-container-highest`)

All design tokens are defined in `tailwind.config.js` and `index.css`.

---

## 🧩 Key Interactions

- **Toast Notifications** — Every actionable button provides immediate feedback via `react-hot-toast`
- **Filter Tabs** — Daily Actions and Alerts support real-time category filtering
- **Toggle Switches** — Emergency bypass, 2FA, and Simple/Technical mode use animated toggles
- **Hover Reveals** — Family member management buttons appear on hover for a clean UI
- **Slide-in Panel** — Technical mode diagnostics panel animates smoothly from the right

---

## 👥 Team Devora

Built with ❤️ for **Its-A-Hack 2.0**

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
