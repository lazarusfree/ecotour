# 🌿 EcoTour — Sustainable Eco-Tourism Marketplace

> *Explore Malaysia Responsibly.*

EcoTour is a web-based marketplace that connects travellers with **verified** eco-tourism
operators and makes conservation funding fully **transparent** — every booking's
conservation levy is recorded, per fund, in an auditable ledger. Built for the
BIC 31502 *Creativity and Innovation* project and aligned with **UN SDG 9
(Industry, Innovation and Infrastructure)**.

## ✨ Features
- **Verified operators** — businesses pass a four-state verification workflow before listing.
- **Transparent conservation ledger** — per-transaction record of every fund contribution.
- **Full booking flow** — browse → cart → sandbox checkout → confirmation.
- **Interactive map** — Leaflet + OpenStreetMap geocoding with tour markers.
- **Secure by design** — bcrypt auth, server sessions, env-var secrets, prepared statements.
- **Responsive & accessible** — WCAG contrast, fluid typography, mobile-first layout.

## 🧱 Tech stack
React 18 · Vite 5 · Tailwind CSS 3 · Leaflet/OpenStreetMap · PHP 8.2 · MariaDB/MySQL · Apache (XAMPP)

## 📂 Repository layout
```
Project/    React + Vite front-end source (edit here)
backend/    PHP 8.2 REST API (api/ endpoints, config/, tests/)
sql/        Database schema, seed data and incremental upgrades
app/        Built front end (ready-to-run HTML/CSS/JS — the deployable package)
database/   Full database dump (ecotour_dump.sql)
```

## 🚀 Quick start (XAMPP)
1. **Place the project** under your web root as `C:\xampp\htdocs\ecotour\`.
2. **Create the database:**
   ```bash
   C:\xampp\mysql\bin\mysql.exe -u root < database/ecotour_dump.sql
   ```
   (or run `sql/ecotour_schema.sql` then `sql/ecotour_seed.sql`)
3. **Run it** — start Apache and open: <http://localhost/ecotour/app/>

### Develop the front end
```bash
cd Project
npm install
npm run dev      # Vite dev server
npm run build    # production build -> copy dist/ into ../app
```

### Run the tests
```bash
C:\xampp\php\php.exe backend/tests/run_tests.php          # backend unit
C:\xampp\php\php.exe backend/tests/integration_test.php   # API integration
cd Project && npm test                                    # front-end (Vitest)
```

## 👤 Demo accounts
| Role | Email | Password |
|------|-------|----------|
| Traveller | `rezza@ecotour.my` | `password123` |
| Admin | `admin@ecotour.my` | `admin123` |

## 🔐 Security notes
Database credentials and the CORS origin are read from environment variables in
`backend/config/config.php` (defaults match a local XAMPP install). Passwords are
hashed with bcrypt and every query uses PDO prepared statements.

---
*Course project — Universiti Tun Hussein Onn Malaysia (UTHM), BIC 31502.*
