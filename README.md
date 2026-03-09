# OrderFlow — Real-Time Order Management Dashboard

A high-performance Order Management Dashboard built with React and Redux Toolkit, capable of handling 2,000+ records with real-time updates, advanced filtering, bulk operations, and optimistic UI updates.

## 🔗 Links
- **Live Demo:** https://oredermanagement.netlify.app/
- **GitHub Repo:** https://github.com/deepikadamwani20/Order-Management-Dashboard

---

## 🚀 Tech Stack

- React 18
- Redux Toolkit
- React Router v6
- React Redux
- date-fns
- Create React App

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18 (recommended)
- npm v8+

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/deepikadamwani20/Order-Management-Dashboard.git
cd Order-Management-Dashboard/order_dashboard
```

**2. Install dependencies**
```bash
npm install --legacy-peer-deps
```

**3. Start the development server**
```bash
npm start
```

**4. Open in browser**
```
http://localhost:3000
```

---

## 🔐 Login Credentials
| Field | Value |
|---|---|
| Email | any valid email |
| Password | `password123` |

---

## ✨ Features

- **Authentication** — JWT mock login with localStorage persistence and protected routes
- **2,000+ Orders** — Seeded mock data with smooth pagination (50 per page)
- **Real-Time Updates** — Random order updates every 5–10 seconds with row highlight animation
- **Advanced Search** — Debounced search by Order ID and Customer Name
- **Filtering** — Filter by status, amount range, and date range simultaneously
- **Sorting** — Sort by Amount, Created Date, Updated Date (asc/desc)
- **Multi-Select** — Select individual or all orders on current page
- **Bulk Operations** — Bulk status update, bulk delete, export CSV/JSON
- **Inline Editing** — Click status badge to edit with optimistic UI + auto rollback
- **Stats Bar** — Live summary of total orders, revenue, pending, delivered

---

## 📁 Project Structure
```
src/
├── api/            → Mock API (auth + orders)
├── app/            → Redux store
├── components/     → UI components with separate CSS
│   ├── auth/
│   ├── bulk/
│   ├── common/
│   ├── dashboard/
│   ├── filters/
│   └── orders/
├── features/       → Redux slices + selectors
├── hooks/          → useDebounce, useRealTimeUpdates
└── utils/          → Data generator, export utilities
```

---

## 📦 Build for Production
```bash
npm run build
```

---

## 🌐 Deployment

This project is deployed on **Netlify** with the following config (`netlify.toml`):
```toml
[build]
  base = "order_dashboard"
  command = "npm run build"
  publish = "order_dashboard/build"

[build.environment]
  CI = "false"
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```