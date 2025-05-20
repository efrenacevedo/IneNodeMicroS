const pool = require('../config/db');

class Domicilio {
  static async create({ calle, numero_exterior, numero_interior, colonia, codigo_postal, municipio_id, estado_id }) {
    const [result] = await pool.execute(
      `INSERT INTO domicilios 
      (calle, numero_exterior, numero_interior, colonia, codigo_postal, municipio_id, estado_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [calle, numero_exterior, numero_interior || null, colonia, codigo_postal, municipio_id, estado_id]
    );
    return result.insertId;
  }

  static async getById(id) {
    const [rows] = await pool.query(
      `SELECT d.*, m.nombre AS municipio, e.nombre AS estado 
      FROM domicilios d
      LEFT JOIN municipios m ON d.municipio_id = m.id
      LEFT JOIN estados e ON d.estado_id = e.id
      WHERE d.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async update(id, { calle, numero_exterior, numero_interior, colonia, codigo_postal, municipio_id, estado_id }) {
    const [result] = await pool.execute(
      `UPDATE domicilios SET 
        calle = ?, numero_exterior = ?, numero_interior = ?, colonia = ?, 
        codigo_postal = ?, municipio_id = ?, estado_id = ?
      WHERE id = ?`,
      [calle, numero_exterior, numero_interior || null, colonia, codigo_postal, municipio_id, estado_id, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM domicilios WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async exists(id) {
    const [rows] = await pool.query('SELECT 1 FROM domicilios WHERE id = ? LIMIT 1', [id]);
    return rows.length > 0;
  }

  static async validateReferences(municipio_id, estado_id) {
    const [municipio] = await pool.query('SELECT 1 FROM municipios WHERE id = ? LIMIT 1', [municipio_id]);
    const [estado] = await pool.query('SELECT 1 FROM estados WHERE id = ? LIMIT 1', [estado_id]);
    
    return {
      municipioExists: municipio.length > 0,
      estadoExists: estado.length > 0
    };
  }
}

module.exports = Domicilio;