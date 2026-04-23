const db = require("../db");

class User {
  // Create user
  static create(username, email, passwordHash, callback) {
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(query, [username, email, passwordHash], callback);
  }

  // Find by username or email
  static findByUsernameOrEmail(identifier, callback) {
    const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.get(query, [identifier, identifier], callback);
  }

  // Find by ID
  static findById(id, callback) {
    const query = `SELECT id, username, email, created_at FROM users WHERE id = ?`;
    db.get(query, [id], callback);
  }

  // Check if username exists
  static usernameExists(username, callback) {
    const query = `SELECT COUNT(*) as count FROM users WHERE username = ?`;
    db.get(query, [username], (err, row) => {
      if (err) return callback(err);
      callback(null, row.count > 0);
    });
  }

  // Check if email exists
  static emailExists(email, callback) {
    const query = `SELECT COUNT(*) as count FROM users WHERE email = ?`;
    db.get(query, [email], (err, row) => {
      if (err) return callback(err);
      callback(null, row.count > 0);
    });
  }
}

module.exports = User;
