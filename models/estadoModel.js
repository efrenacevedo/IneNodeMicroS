const pool = require('../config/db');

class Estado {
  static async create({ nombre, codigo }) {
    const [result] = await pool.execute(
      'INSERT INTO estados (nombre, codigo) VALUES (?, ?)',
      [nombre, codigo]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM estados ORDER BY nombre');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM estados WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { nombre, codigo }) {
    const [result] = await pool.execute(
      'UPDATE estados SET nombre = ?, codigo = ? WHERE id = ?',
      [nombre, codigo, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM estados WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async exists(id) {
    const [rows] = await pool.query('SELECT 1 FROM estados WHERE id = ? LIMIT 1', [id]);
    return rows.length > 0;
  }
}

module.exports = Estado;