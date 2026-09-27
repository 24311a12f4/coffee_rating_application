# ☕ Coffee Rating App

An interactive, beginner-friendly coffee voting application built with **Node.js**, **Express**, **SQLite3**, **EJS**, and **Vanilla JavaScript**.

---

## 📖 Description

Users can browse a grid of 6 popular coffee types and vote for their favourites. Every vote is saved to a SQLite database and the UI — including the vote count on the card and the top-rated leaderboard — updates **without a full page refresh**, thanks to the Fetch API.

---

## ✨ Features

- 🗳️ One-click voting with live UI updates (no page reload)
- 🏆 Real-time leaderboard sorted by votes
- 🛡️ Double-click protection (in-flight guard)
- ✅ Success / ❌ Error toast messages
- 💾 SQLite database as the single source of truth
- 📱 Fully responsive — works on mobile and desktop
- 🎨 Coffee-themed design with smooth hover animations

---

## 🛠️ Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Runtime     | Node.js                 |
| Framework   | Express.js              |
| Database    | SQLite3                 |
| Templating  | EJS                     |
| Frontend    | HTML · CSS · Vanilla JS |
| Dev tool    | Nodemon                 |

---

## 📁 Project Structure

```
coffee-rating-app/
│
├── server.js          ← Express server + DB logic + API routes
├── package.json
├── package-lock.json
├── coffee.db          ← Auto-created SQLite database (git-ignored)
├── .gitignore
├── README.md
│
├── views/
│   └── index.ejs      ← Homepage template (coffee grid + leaderboard)
│
└── public/
    ├── style.css      ← Styling (coffee theme, responsive layout)
    └── script.js      ← Fetch-based voting + live updates
```

---

## 🚀 Installation & Running

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/coffee-rating-app.git
cd coffee-rating-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

### 4. Open in your browser

```
http://localhost:3000
```

---

## 🔌 Available API Routes

| Method | Endpoint                     | Description                              |
|--------|------------------------------|------------------------------------------|
| GET    | `/`                          | Homepage — renders coffee grid + leaderboard |
| GET    | `/api/coffee`                | Returns all coffees sorted by votes DESC |
| POST   | `/api/coffee/:id/vote`       | Increments vote for the given coffee ID  |

### Example Responses

**GET /api/coffee**
```json
[
  { "id": 1, "name": "Cappuccino", "description": "...", "votes": 12 },
  { "id": 3, "name": "Espresso",   "description": "...", "votes": 9  }
]
```

**POST /api/coffee/1/vote**
```json
{ "success": true, "coffee": { "id": 1, "name": "Cappuccino", "description": "...", "votes": 13 } }
```

**Error (404)**
```json
{ "error": "Coffee with ID 99 not found." }
```

---

## 🗳️ How Voting Works

1. User clicks **👍 Vote** on a coffee card.
2. `script.js` sends a `POST /api/coffee/:id/vote` request via `fetch()`.
3. `server.js` runs `UPDATE coffees SET votes = votes + 1 WHERE id = ?`.
4. The updated record is returned as JSON.
5. The card's vote counter and the leaderboard update instantly — **no page reload**.

---

## 💾 Database Information

- **Engine**: SQLite3 (`coffee.db`)
- **Table**: `coffees`

| Column      | Type    | Notes                    |
|-------------|---------|--------------------------|
| id          | INTEGER | Primary key, autoincrement |
| name        | TEXT    | Coffee name (not null)   |
| description | TEXT    | Short description        |
| votes       | INTEGER | Default 0                |

The database and table are created automatically when the server starts.  
The 6 default coffees are seeded only when the table is empty.

---

## 🌐 Deployment

### Deploy to [Render](https://render.com) (free tier)

1. Push the project to GitHub.
2. Create a new **Web Service** on Render.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Choose **Free** plan and deploy.

> ⚠️ Render's free tier has an ephemeral filesystem — `coffee.db` resets on redeploy. Use a persistent disk add-on or migrate to [Turso](https://turso.tech) / [Railway](https://railway.app) for production persistence.

### Deploy to [Railway](https://railway.app)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## 📝 License

MIT — free to use and modify.
