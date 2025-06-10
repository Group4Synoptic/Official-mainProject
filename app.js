require('dotenv').config();
const express = require("express");
const path = require("path");
const http = require('http');
const { Server } = require('socket.io');
const fs = require("fs");
const { Pool } = require('pg');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const port = 1942;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: false
});

pool.query('SET search_path TO "synopticProjectRegistration";');

const sessionMiddleware = session({
  store: new SQLiteStore,
  secret: 'RANDOMKEYCHANGE',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
});

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

// -------------------- HTTP + Socket.IO Setup --------------------
const server = http.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

io.on('connection', (socket) => {
  console.log('a user connected, socket id:', socket.id);
});


// -------------------- Non-API Routes --------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
    if (err) console.log(err);
  });
});


// -------------------- Middleware --------------------
function isAuthenticated(req, res, next) {
  if (req.session.user) next();
  else res.status(401).json({ success: false, error: 'You need to login' });
}


// -------------------- API Routes --------------------

//  Auth
app.post('/api/register', async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;
  if (!username || !password || !confirmPassword || !email) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, error: 'Passwords do not match' });
  }
  try {
    const userExists = await pool.query(
      `SELECT * FROM "synopticProjectRegistration".users WHERE username = $1 OR email = $2`,
      [username, email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Username or email already exists' });
    }

    const result = await pool.query(
      `INSERT INTO "synopticProjectRegistration".users (username, password, email) VALUES ($1, $2, $3) RETURNING id`,
      [username, password, email]
    );
    res.json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM "synopticProjectRegistration".users WHERE username = $1 AND password = $2`,
      [username, password]
    );
    if (result.rows.length === 1) {
      req.session.user = {
        id: result.rows[0].id,
        username: result.rows[0].username
      };
      req.session.save(err => {
        if (err) return res.status(500).json({ success: false, error: 'Session failed' });
        return res.json({ success: true, message: 'Logged in!' });
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, error: 'Logout failed' });
    res.json({ success: true, message: 'Logged out!' });
  });
});

app.get('/api/session', (req, res) => {
  if (req.session.user) {
    res.json({ 
      loggedIn: true, 
      username: req.session.user.username, 
      id: req.session.user.id 
    });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/api/session-username', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
});


//  Contact
app.post('/api/contact', (req, res) => {
  const { firstName, lastName, email, message, contactReason, timestamp } = req.body;

  if (!firstName || !lastName || !email || !message || !contactReason) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  let usersjson = fs.readFileSync("public/json/contact.json", "utf-8");
  let users;
  try {
    users = JSON.parse(usersjson);
    if (!users.contactFormSubmissions) users.contactFormSubmissions = [];
  } catch (err) {
    users = { contactFormSubmissions: [] };
  }

  users.contactFormSubmissions.push(req.body);
  fs.writeFileSync("public/json/contact.json", JSON.stringify(users, null, 2), "utf-8");

  res.json({ success: true });
});


//  Water Requests
app.post('/api/request-water', async (req, res) => {
  const { litres, urgency, contact, reservoir_id } = req.body;

  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  if (!litres || !urgency || !contact || !reservoir_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await pool.query(
      `INSERT INTO "synopticProjectRegistration".water_requests (litres, urgency, user_id, contact_info, request_completed, reservoir_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [litres, urgency, req.session.user.id, contact, false, reservoir_id]
    );

    io.emit('new-request', {
      userId: req.session.user.id,
      litres,
      urgency,
      contact,
      reservoir_id
    });

    res.json({ message: 'Water request submitted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/water-request', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "synopticProjectRegistration".water_requests WHERE user_id = $1 ORDER BY id DESC`,
      [req.session.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching water requests:', err);
    res.status(500).json({ message: 'Failed to load requests' });
  }
});


//  Trading
app.post("/api/trade", async (req, res) => {
  try {
    const { trade_direction, amount_in, contact_info } = req.body;
    const user_id = req.session.user?.id;
    if (!user_id) return res.status(401).json({ error: "Not logged in" });

    const ratio = 50;
    const calculated_return = trade_direction === "water_to_electricity"
      ? amount_in * ratio
      : amount_in / ratio;

    let trade_type;
    if (trade_direction === "water_to_electricity") trade_type = "water";
    else if (trade_direction === "electricity_to_water") trade_type = "energy";
    else return res.status(400).json({ error: "Invalid trade direction" });

    if (isNaN(amount_in) || isNaN(calculated_return)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    await pool.query(`
      INSERT INTO "synopticProjectRegistration".water_energy_trades ( trade_type, amount, calculated_return, user_id, contact_info)
      VALUES ($1, $2, $3, $4, $5)
    `, [trade_type, amount_in, calculated_return, user_id, contact_info]);

    io.emit('new-trade', {
      trade_type,
      amount: amount_in,
      calculated_return,
      contact_info,
      user_id
    });

    res.json({ message: "Trade successfully submitted!" });
  } catch (err) {
    console.error("Trade error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/trades', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "synopticProjectRegistration".water_energy_trades WHERE user_id = $1 ORDER BY id DESC`,
      [req.session.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching trades:', err);
    res.status(500).json({ message: 'Failed to load trades' });
  }
});


// Reservoirs


app.get('/api/reservoirs', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, capacity, current_level, status FROM "synopticProjectRegistration".reservoirs ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load reservoirs' });
  }
});

// -------------------- Start Server --------------------
server.listen(port, () => {
  console.log(`myapp is listening on port ${port}!`);
});



// --- ADMIN: List all requests ---
app.get('/api/admin/requests', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, litres, urgency, reservoir_id, request_completed, contact_info
       FROM "synopticProjectRegistration".water_requests
       ORDER BY id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load requests' });
  }
});

// --- ADMIN: Accept/complete a request and update reservoir ---
app.post('/api/admin/accept-request', async (req, res) => {
  const { id, reservoir_id, litres } = req.body;
  try {
    // Mark request as completed
    await pool.query(
      `UPDATE "synopticProjectRegistration".water_requests SET request_completed = true WHERE id = $1`,
      [id]
    );
    // Subtract litres from reservoir
    await pool.query(
      `UPDATE "synopticProjectRegistration".reservoirs SET current_level = GREATEST(current_level - $1, 0) WHERE id = $2`,
      [litres, reservoir_id]
    );
    // Notify all clients
    io.emit('request-updated', { id, reservoir_id, litres });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request/reservoir' });
  }
});

