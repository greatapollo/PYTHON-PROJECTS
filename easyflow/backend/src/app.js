const express = require("express");
const cors = require("cors");

const app = express();

// Import routes
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth.routes");

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "OK" }));
app.get("/", (req, res) => res.send("EasyFlow Backend is running"));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
