const pool = require('../config/db');

class Persona {
  static async create({ 
    nombre, 
    apellido_paterno, 
    apellido_materno, 
    fecha_nacimiento, 
    genero, 
    curp, 
    clave_elector, 
    numero_ine, 
    domicilio_id, 
    seccion_electoral_id, 
    fecha_emision, 
    fecha_vencimiento, 
    vigencia 
  }) {
    const [result] = await pool.execute(
      `INSERT INTO personas 
      (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, genero, 
       curp, clave_elector, numero_ine, domicilio_id, seccion_electoral_id,
       fecha_emision, fecha_vencimiento, vigencia) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        genero,
        curp,
        clave_elector,
        numero_ine,
        domicilio_id,
        seccion_electoral_id,
        fecha_emision,
        fecha_vencimiento,
        vigencia
      ]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.query(`
      SELECT p.*, 
             d.calle, d.numero_exterior, d.numero_interior, d.colonia, d.codigo_postal,
             m.nombre AS municipio, e.nombre AS estado,
             se.numero AS seccion_electoral, se.distrito
      FROM personas p
      LEFT JOIN domicilios d ON p.domicilio_id = d.id
      LEFT JOIN municipios m ON d.municipio_id = m.id
      LEFT JOIN estados e ON d.estado_id = e.id
      LEFT JOIN secciones_electorales se ON p.seccion_electoral_id = se.id
      ORDER BY p.apellido_paterno, p.apellido_materno, p.nombre
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query(`
      SELECT p.*, 
             d.calle, d.numero_exterior, d.numero_interior, d.colonia, d.codigo_postal,
             m.nombre AS municipio, e.nombre AS estado,
             se.numero AS seccion_electoral, se.distrito
      FROM personas p
      LEFT JOIN domicilios d ON p.domicilio_id = d.id
      LEFT JOIN municipios m ON d.municipio_id = m.id
      LEFT JOIN estados e ON d.estado_id = e.id
      LEFT JOIN secciones_electorales se ON p.seccion_electoral_id = se.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async update(id, { 
    nombre, 
    apellido_paterno, 
    apellido_materno, 
    fecha_nacimiento, 
    genero, 
    curp, 
    clave_elector, 
    numero_ine, 
    domicilio_id, 
    seccion_electoral_id, 
    fecha_emision, 
    fecha_vencimiento, 
    vigencia 
  }) {
    const [result] = await pool.execute(
      `UPDATE personas SET 
        nombre = ?, apellido_paterno = ?, apellido_materno = ?, fecha_nacimiento = ?,
        genero = ?, curp = ?, clave_elector = ?, numero_ine = ?, domicilio_id = ?,
        seccion_electoral_id = ?, fecha_emision = ?, fecha_vencimiento = ?, vigencia = ?
      WHERE id = ?`,
      [
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        genero,
        curp,
        clave_elector,
        numero_ine,
        domicilio_id,
        seccion_electoral_id,
        fecha_emision,
        fecha_vencimiento,
        vigencia,
        id
      ]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM personas WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async validateReferences(domicilio_id, seccion_electoral_id) {
    const [domicilio] = await pool.query('SELECT 1 FROM domicilios WHERE id = ? LIMIT 1', [domicilio_id]);
    const [seccion] = await pool.query('SELECT 1 FROM secciones_electorales WHERE id = ? LIMIT 1', [seccion_electoral_id]);
    
    return {
      domicilioExists: domicilio.length > 0,
      seccionExists: seccion.length > 0
    };
  }

  static async searchByCurp(curp) {
    const [rows] = await pool.query('SELECT * FROM personas WHERE curp = ?', [curp]);
    return rows[0];
  }

  static async searchByIne(numero_ine) {
    const [rows] = await pool.query('SELECT * FROM personas WHERE numero_ine = ?', [numero_ine]);
    return rows[0];
  }
}

module.exports = Persona;