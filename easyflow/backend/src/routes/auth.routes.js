const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "easyflow_jwt_secret_2024";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Log ALL requests entering router
router.use((req, res, next) => {
  console.log(`[AUTH ROUTER] Received: ${req.method} ${req.url}`);
  next();
});

router.post("/login", authLimiter, async (req, res) => {
  console.log("[AUTH] Login attempt:", req.body.username);
  
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.get(query, [username, username], async (err, user) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at
        }
      });
    });
  } catch (err) {
    console.error("[AUTH] Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/register", authLimiter, async (req, res) => {
  console.log("[AUTH] Register attempt:", req.body.username);
  
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ 
      error: "Username, email, and password required",
      field: !username ? "username" : !email ? "email" : "password"
    });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    
    db.run(query, [username, email, hashed], function(err) {
      if (err) {
        if (err.message.includes("username")) return res.status(409).json({ error: "Username exists", field: "username" });
        if (err.message.includes("email")) return res.status(409).json({ error: "Email exists", field: "email" });
        return res.status(500).json({ error: "Database error" });
      }

      const token = jwt.sign({ userId: this.lastID, username, email }, JWT_SECRET, { expiresIn: "7d" });
      
      res.status(201).json({
        token,
        user: { id: this.lastID, username, email, createdAt: new Date().toISOString() }
      });
    });
  } catch (err) {
    console.error("[AUTH] Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/test", (req, res) => {
  res.json({ 
    status: "✅ AUTH ROUTER ACTIVE",
    routes: {
      "POST /login": "User login",
      "POST /register": "User registration",
      "GET /test": "Health check"
    }
  });
});

// Catch-all for AUTH ROUTER (debug unmatched routes)
router.use((req, res) => {
  console.error(`[AUTH ROUTER] ❌ NO MATCH: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Auth route not found in router" });
});

module.exports = router;
