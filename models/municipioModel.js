const pool = require('../config/db');

class Municipio {
  static async create({ nombre, estado_id }) {
    const [result] = await pool.execute(
      'INSERT INTO municipios (nombre, estado_id) VALUES (?, ?)',
      [nombre, estado_id]
    );
    return result.insertId;
  }

  static async getByEstado(estado_id) {
    const [rows] = await pool.query(
      'SELECT * FROM municipios WHERE estado_id = ? ORDER BY nombre',
      [estado_id]
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM municipios WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { nombre, estado_id }) {
    const [result] = await pool.execute(
      'UPDATE municipios SET nombre = ?, estado_id = ? WHERE id = ?',
      [nombre, estado_id, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM municipios WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async exists(id) {
    const [rows] = await pool.query('SELECT 1 FROM municipios WHERE id = ? LIMIT 1', [id]);
    return rows.length > 0;
  }
}

module.exports = Municipio;