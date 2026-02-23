# AI Text Summarizer

A modern, premium SaaS web application that summarizes text using the Google Gemini API. Built with a stunning, responsive UI featuring glassmorphism, smooth animations, and secure authentication.

- **Frontend**: React + Vite, TailwindCSS, Framer Motion, Material UI
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT via HTTP‑only cookie, Email/Password and Google OAuth
- **Dev servers**: Frontend http://localhost:5173, Backend http://localhost:8000

## Features
- **Advanced AI Summarization**: Instantly summarize long text and articles using Google Gemini.
- **Premium SaaS UI**: Beautiful, engaging interface with glassmorphism, subtle micro-animations, and dynamic feedback.
- **Secure Authentication**: Full support for Email/Password registration and Google OAuth login.
- **Protected User Dashboard**: Secure routes for the summarizer, history, and user profile.
- **History Tracking**: Automatically save and manage a complete history of generated summaries.
- **Fully Responsive**: Optimized experience across desktop, tablet, and mobile devices.

## Repository Structure

```
AI-Text-Summarizer-main/
├── backend/
│   ├── server.js                 # Express app, CORS, cookies
│   ├── config/db.js              # Mongo connection
│   ├── controllers/              # authController, summaryController, historyController
│   ├── middleware/auth.js        # verifyJWT
│   ├── models/                   # User.js, Summary.js
│   └── routes/                   # authRoutes.js, summaryRoutes.js, historyRoutes.js
└── frontend/
    ├── src/
    │   ├── pages/                # Login, Register, Home, Summarizer, History, Profile
    │   ├── components/           # Navbar, PrivateRoute, SummaryForm, HistoryList
    │   ├── context/AuthContext.jsx
    │   ├── App.jsx
    │   └── index.css
    ├── public/                   # static assets (e.g., auth-bg.png)
    └── vite.config.js            # dev proxy to backend
```

## Backend Setup

Create `backend/.env`:

```bash
PORT=8000
MONGO_URI=mongodb://localhost:27017/ai-summarizer
JWT_SECRET=your_long_random_secret
# Allow one or more frontend origins (comma‑separated). Dev defaults also allow 5173‑5179.
CLIENT_ORIGINS=http://localhost:5173

# Google Gemini
GOOGLE_API_KEY=your_google_api_key
GOOGLE_GEMINI_MODEL=gemini-1.5-flash
```

Notes:
- `server.js` enables CORS with `credentials: true`, and allows localhost Vite ports by default.
- JWT token cookie is issued in `authController.issueToken()` as `token` (HTTP‑only).
- `summaryController.js` calls the Google Generative Language API using `GOOGLE_API_KEY` and `GOOGLE_GEMINI_MODEL`.

Install and run backend:

```bash
cd backend
npm install
npm run dev   # or: node server.js
```

## Frontend Setup

Create `frontend/.env.local` (do not commit):

```bash
VITE_BACKEND_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

Install and run frontend:

```bash
cd frontend
npm install
npm run dev    # Vite dev server on 5173
```

Vite dev proxy (`vite.config.js`) forwards `/auth` and `/api` to `http://localhost:8000`.

## Authentication Flow

- `POST /auth/register` and `POST /auth/login` set an HTTP‑only cookie `token`.
- `GET /auth/me` requires the cookie and returns the user, otherwise 401.
- Frontend sends `withCredentials: true` for auth requests.
- `AuthContext.jsx` restores the session on mount with `/auth/me` and supports `logout()`.

## API Endpoints

Auth
- `POST /auth/register` { name, email, password }
- `POST /auth/login` { email, password }
- `POST /auth/google` { id_token }
- `GET /auth/me` (auth)
- `POST /auth/logout` (auth)

Summarization & History (auth)
- `POST /api/summary` → returns generated summary
- `GET /api/history` → returns user’s summary history

## Common Issues

- 401 on `/auth/me` on first load is expected before login. Log in to receive the cookie.
- If cookies aren’t set/sent:
  - Ensure frontend requests use `{ withCredentials: true }`.
  - Access via `http://localhost:5173` (match CORS origin; avoid mixing 127.0.0.1).
  - System time must be correct for JWTs.
- Background image not visible on auth pages:
  - Place `auth-bg.png` in `frontend/public/`.
  - Hard refresh, and verify `http://localhost:5173/auth-bg.png` loads (status 200).

## Scripts

Backend
- `npm run dev` – start Express in dev

Frontend
- `npm run dev` – start Vite dev server
- `npm run build` – build production assets
- `npm run preview` – preview production build

## Production

- Set `NODE_ENV=production` on the backend; cookies use `secure` and `sameSite=none` when cross‑site.
- Host the frontend build (Netlify/Vercel/etc.) and configure backend `CLIENT_ORIGINS` accordingly.
- Use a managed MongoDB (e.g., MongoDB Atlas).

## License

MIT (or update to your preferred license)