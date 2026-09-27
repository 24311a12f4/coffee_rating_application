const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── EJS Setup ────────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper available in every EJS template
app.locals.emojiFor = function emojiFor(name) {
  const map = {
    cappuccino: '☕',
    latte:      '🥛',
    espresso:   '⚡',
    americano:  '🫖',
    mocha:      '🍫',
    'cold brew':'🧊',
  };
  return map[(name || '').toLowerCase()] || '☕';
};

// ─── Database Setup ───────────────────────────────────────────────────────────
const db = new sqlite3.Database(path.join(__dirname, 'coffee.db'), (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database.');
});

// Default coffee items
const defaultCoffees = [
  { name: 'Cappuccino',  description: 'Rich espresso topped with velvety steamed milk foam — a timeless Italian classic.' },
  { name: 'Latte',       description: 'Smooth espresso blended with creamy steamed milk for a mellow, comforting sip.' },
  { name: 'Espresso',    description: 'A bold, concentrated shot of pure coffee — the heart of every great brew.' },
  { name: 'Americano',   description: 'Espresso diluted with hot water, delivering a strong yet smooth black coffee.' },
  { name: 'Mocha',       description: 'A heavenly blend of espresso, rich chocolate, and steamed milk. Dessert in a cup.' },
  { name: 'Cold Brew',   description: 'Slow-steeped for 12+ hours in cold water, producing a silky, low-acid concentrate.' },
];

// Create table and seed data on startup
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS coffees (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      description TEXT,
      votes       INTEGER DEFAULT 0
    )`,
    (err) => {
      if (err) {
        console.error('❌ Error creating table:', err.message);
        return;
      }
      console.log('✅ Table "coffees" ready.');

      // Seed default data only when the table is empty
      db.get('SELECT COUNT(*) AS count FROM coffees', (err, row) => {
        if (err) { console.error('❌ Error checking rows:', err.message); return; }

        if (row.count === 0) {
          const stmt = db.prepare(
            'INSERT INTO coffees (name, description) VALUES (?, ?)'
          );
          defaultCoffees.forEach((c) => stmt.run(c.name, c.description));
          stmt.finalize();
          console.log('✅ Seeded 6 default coffee items.');
        }
      });
    }
  );
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET / — render homepage with initial data from DB
app.get('/', (req, res) => {
  db.all('SELECT * FROM coffees ORDER BY votes DESC', (err, coffees) => {
    if (err) {
      console.error('❌ DB error on GET /:', err.message);
      return res.status(500).send('Internal Server Error');
    }
    res.render('index', { coffees });
  });
});

// GET /api/coffee — return all coffees sorted by votes DESC
app.get('/api/coffee', (req, res) => {
  db.all('SELECT * FROM coffees ORDER BY votes DESC', (err, coffees) => {
    if (err) {
      console.error('❌ DB error on GET /api/coffee:', err.message);
      return res.status(500).json({ error: 'Database error.' });
    }
    res.json(coffees);
  });
});

// POST /api/coffee/:id/vote — increment vote for a specific coffee
app.post('/api/coffee/:id/vote', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid coffee ID.' });
  }

  // First check if the coffee exists
  db.get('SELECT * FROM coffees WHERE id = ?', [id], (err, coffee) => {
    if (err) {
      console.error('❌ DB error on SELECT:', err.message);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!coffee) {
      return res.status(404).json({ error: `Coffee with ID ${id} not found.` });
    }

    // Increment vote
    db.run(
      'UPDATE coffees SET votes = votes + 1 WHERE id = ?',
      [id],
      function (err) {
        if (err) {
          console.error('❌ DB error on UPDATE:', err.message);
          return res.status(500).json({ error: 'Database error while voting.' });
        }

        // Return the updated record
        db.get('SELECT * FROM coffees WHERE id = ?', [id], (err, updated) => {
          if (err) {
            console.error('❌ DB error on re-fetch:', err.message);
            return res.status(500).json({ error: 'Database error.' });
          }
          res.json({ success: true, coffee: updated });
        });
      }
    );
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Coffee Rating App running at http://localhost:${PORT}`);
});
