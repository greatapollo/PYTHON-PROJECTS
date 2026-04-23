const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "easyflow_jwt_secret_2024";

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded; // store decoded info in request
    next();
  });
}

module.exports = authenticate;
