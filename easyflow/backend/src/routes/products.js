const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const db = require("../db");
const authenticate = require("../middleware/auth.middleware");

const productsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// All product routes require authentication
router.use(productsLimiter);
router.use(authenticate);

/* ---------------------------------------------------
   Helpers
--------------------------------------------------- */
function formatRow(row) {
  if (!row) return null;

  return {
    ...row,
    created_at: row.created_at
      ? new Date(row.created_at.replace(" ", "T") + ".000Z").toISOString()
      : null
  };
}

/* ---------------------------------------------------
   POST /api/products — Create product
--------------------------------------------------- */
router.post("/", (req, res) => {
  const { name, batch_number } = req.body;

  if (!name || !batch_number) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const query = `
    INSERT INTO products (name, batch_number)
    VALUES (?, ?)
  `;

  db.run(query, [name, batch_number], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    db.get(
      "SELECT * FROM products WHERE id = ?",
      [this.lastID],
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(formatRow(row));
      }
    );
  });
});

/* ---------------------------------------------------
   GET /api/products — Pagination + Search + Sort
--------------------------------------------------- */
router.get("/", (req, res) => {
  const {
    search = "",
    sort = "newest",
    page = 1,
    limit = 5
  } = req.query;

  const offset = (page - 1) * limit;
  const searchValue = `%${search}%`;

  let orderBy = "id DESC";

  switch (sort) {
    case "oldest":
      orderBy = "id ASC";
      break;
    case "name-asc":
      orderBy = "name ASC";
      break;
    case "name-desc":
      orderBy = "name DESC";
      break;
    case "batch-asc":
      orderBy = "batch_number ASC";
      break;
    case "batch-desc":
      orderBy = "batch_number DESC";
      break;
  }

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM products
    WHERE name LIKE ? OR batch_number LIKE ?
  `;

  const dataQuery = `
    SELECT *
    FROM products
    WHERE name LIKE ? OR batch_number LIKE ?
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  db.get(countQuery, [searchValue, searchValue], (err, count) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all(
      dataQuery,
      [searchValue, searchValue, Number(limit), Number(offset)],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          total: count.total,
          page: Number(page),
          limit: Number(limit),
          products: rows.map(formatRow)
        });
      }
    );
  });
});

/* ---------------------------------------------------
   GET /api/products/:id — Single product
--------------------------------------------------- */
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(formatRow(row));
  });
});

/* ---------------------------------------------------
   PUT /api/products/:id — Update product
--------------------------------------------------- */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, batch_number } = req.body;

  if (!name || !batch_number) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const query = `
    UPDATE products
    SET name = ?, batch_number = ?
    WHERE id = ?
  `;

  db.run(query, [name, batch_number, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(formatRow(row));
    });
  });
});

/* ---------------------------------------------------
   DELETE /api/products/:id — Delete product
--------------------------------------------------- */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  });
});

module.exports = router;
