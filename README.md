# NOTAP Compliance Platform — Demo v2.0

A demo-ready web application for the **National Office for Technology Acquisition and Promotion (NOTAP)**, simulating the full compliance workflow for foreign technology transfer registration in Nigeria.

---

## 🚀 Getting Started (Local)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## ☁️ Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import the repository
4. Leave all settings as default (Vercel auto-detects Vite)
5. Click **Deploy**

The `vercel.json` file handles SPA routing automatically.

---

## 🎭 Demo Portals

| Role | Access | Description |
|------|--------|-------------|
| **NOTAP Administrator** | `/admin` | Review queue, approve/reject submissions, analytics |
| **Local Partner** | `/partner` | Submit technology transfers, manage client portfolio |
| **Software Acquirer** | `/acquirer` | View technologies, download certificates |

All data is fictional and for demonstration purposes only.

---

## 🗂️ Project Structure

```
src/
├── App.jsx                    # Router + auth guards
├── main.jsx                   # React entry point
├── index.css                  # Global styles + Tailwind
├── context/
│   └── AuthContext.jsx        # Auth state management
├── data/
│   └── mockData.js            # All demo data
├── components/
│   ├── Layout.jsx             # Sidebar + header shell
│   └── ui.jsx                 # Shared components (Badge, StatCard, Modal, Button)
└── pages/
    ├── Login.jsx              # Role selection screen
    ├── admin/
    │   ├── Dashboard.jsx      # Admin overview + charts
    │   ├── ReviewQueue.jsx    # Submission review + approve/reject
    │   └── Analytics.jsx      # Trend charts + sector breakdown
    ├── partner/
    │   ├── Dashboard.jsx      # Partner overview
    │   ├── Submissions.jsx    # Submissions list
    │   └── NewSubmission.jsx  # 5-step submission wizard
    └── acquirer/
        └── Dashboard.jsx      # Technologies + certificates
```

---

## 🛠️ Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** for styling
- **React Router 6** for navigation
- **Recharts** for analytics visualisation
- **Lucide React** for icons

---

## 📝 Notes

- This is a **frontend-only demo** with no backend. All state is in-memory and resets on page refresh.
- To add persistence, connect to a backend API or Supabase and replace the `mockData.js` imports with API calls.
- The `vercel.json` ensures all routes redirect to `index.html` for client-side routing.
