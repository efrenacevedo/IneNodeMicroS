const pool = require('../config/db');

class Persona {
  static async create(personaData) {
    const query = `
      INSERT INTO personas (
        nombre, apellido_paterno, apellido_materno, fecha_nacimiento,
        genero, curp, clave_elector, numero_ine, calle, numero_exterior,
        numero_interior, colonia, municipio, estado, codigo_postal, pais,
        fecha_emision, fecha_vencimiento, seccion_electoral, vigencia
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      personaData.nombre,
      personaData.apellido_paterno,
      personaData.apellido_materno,
      personaData.fecha_nacimiento,
      personaData.genero,
      personaData.curp,
      personaData.clave_elector,
      personaData.numero_ine,
      personaData.calle,
      personaData.numero_exterior,
      personaData.numero_interior,
      personaData.colonia,
      personaData.municipio,
      personaData.estado,
      personaData.codigo_postal,
      personaData.pais,
      personaData.fecha_emision,
      personaData.fecha_vencimiento,
      personaData.seccion_electoral,
      personaData.vigencia
    ];

    const [result] = await pool.execute(query, values);
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM personas');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM personas WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, personaData) {
    const query = `
      UPDATE personas SET 
        nombre = ?, apellido_paterno = ?, apellido_materno = ?, fecha_nacimiento = ?,
        genero = ?, curp = ?, clave_elector = ?, numero_ine = ?, calle = ?, numero_exterior = ?,
        numero_interior = ?, colonia = ?, municipio = ?, estado = ?, codigo_postal = ?, pais = ?,
        fecha_emision = ?, fecha_vencimiento = ?, seccion_electoral = ?, vigencia = ?
      WHERE id = ?
    `;
    
    const values = [
      personaData.nombre,
      personaData.apellido_paterno,
      personaData.apellido_materno,
      personaData.fecha_nacimiento,
      personaData.genero,
      personaData.curp,
      personaData.clave_elector,
      personaData.numero_ine,
      personaData.calle,
      personaData.numero_exterior,
      personaData.numero_interior,
      personaData.colonia,
      personaData.municipio,
      personaData.estado,
      personaData.codigo_postal,
      personaData.pais,
      personaData.fecha_emision,
      personaData.fecha_vencimiento,
      personaData.seccion_electoral,
      personaData.vigencia,
      id
    ];

    const [result] = await pool.execute(query, values);
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM personas WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Persona;