const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "easyflow_jwt_secret_2024";

// Register user
const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ 
      error: "Username, email, and password are required",
      field: !username ? "username" : !email ? "email" : "password"
    });
  }

  try {
    // Check if username exists
    User.usernameExists(username, async (err, exists) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (exists) {
        return res.status(409).json({ error: "Username already exists", field: "username" });
      }

      // Check if email exists
      User.emailExists(email, async (err, exists) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (exists) {
          return res.status(409).json({ error: "Email already registered", field: "email" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        User.create(username, email, hashedPassword, function (err) {
          if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "Database error" });
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: this.lastID, username, email },
            JWT_SECRET,
            { expiresIn: "7d" }
          );

          res.status(201).json({
            token,
            user: {
              id: this.lastID,
              username,
              email,
              createdAt: new Date().toISOString()
            }
          });
        });
      });
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Login user
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Find user by username or email
  User.findByUsernameOrEmail(username, async (err, user) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    try {
      // Verify password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Return token + sanitized user data
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at
        }
      });
    } catch (compareErr) {
      console.error("Password compare error:", compareErr);
      res.status(500).json({ error: "Authentication failed" });
    }
  });
};

module.exports = {
  register,
  login
};
