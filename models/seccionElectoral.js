const pool = require('../config/db');

class SeccionElectoral {
  static async create({ numero, distrito, municipio_id }) {
    const [result] = await pool.execute(
      'INSERT INTO secciones_electorales (numero, distrito, municipio_id) VALUES (?, ?, ?)',
      [numero, distrito, municipio_id]
    );
    return result.insertId;
  }

  static async getByMunicipio(municipio_id) {
    const [rows] = await pool.query(
      'SELECT * FROM secciones_electorales WHERE municipio_id = ? ORDER BY numero',
      [municipio_id]
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM secciones_electorales WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { numero, distrito, municipio_id }) {
    const [result] = await pool.execute(
      'UPDATE secciones_electorales SET numero = ?, distrito = ?, municipio_id = ? WHERE id = ?',
      [numero, distrito, municipio_id, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM secciones_electorales WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async exists(id) {
    const [rows] = await pool.query('SELECT 1 FROM secciones_electorales WHERE id = ? LIMIT 1', [id]);
    return rows.length > 0;
  }
}

module.exports = SeccionElectoral;