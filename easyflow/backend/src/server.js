require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE ORDER IS CRITICAL
app.use(cors());
app.use(express.json()); // MUST come BEFORE route mounts

// Health checks
app.get("/health", (req, res) => res.json({ status: "OK" }));
app.get("/", (req, res) => res.send("✅ EasyFlow Backend"));

// ROUTE MOUNT ORDER (auth BEFORE products)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Global 404 handler
app.use((req, res) => {
  console.log(`[GLOBAL 404] ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found", url: req.url });
});

app.listen(PORT, () => {
  console.log(`\n✅✅✅ BACKEND READY ✅✅✅`);
  console.log(`📍 Test auth: http://localhost:${PORT}/api/auth/test`);
  console.log(`📍 Login: http://localhost:${PORT}/api/auth/login (POST)`);
  console.log(`📍 Check terminal logs for [AUTH ROUTER] messages\n`);
});
