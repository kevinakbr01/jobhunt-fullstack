const pool = require("../config/db");

const User = {
  // Mencari user berdasarkan email
  async findByEmail(email) {
    const [users] = await pool.query(
      `SELECT id, name, email, password, role, created_at
       FROM users
       WHERE email = ?`,
      [email],
    );

    return users[0] || null;
  },

  // Mencari user berdasarkan ID
  async findById(id) {
    const [users] = await pool.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE id = ?`,
      [id],
    );

    return users[0] || null;
  },

  // Membuat user baru
  async create({ name, email, password, role }) {
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, password, role],
    );

    return result.insertId;
  },
};

module.exports = User;
