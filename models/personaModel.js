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

  static async getByCurp(curp) {
  const [rows] = await pool.query(`
    SELECT p.*, d.calle, d.numero_exterior, d.numero_interior, d.colonia, 
           d.codigo_postal, m.nombre AS municipio, e.nombre AS estado,
           se.numero AS seccion_electoral, se.distrito
    FROM personas p
    JOIN domicilios d ON p.domicilio_id = d.id
    JOIN municipios m ON d.municipio_id = m.id
    JOIN estados e ON m.estado_id = e.id
    JOIN secciones_electorales se ON p.seccion_electoral_id = se.id
    WHERE p.curp = ?
  `, [curp]);
  return rows[0];
}

static async deleteByCurp(curp) {
  // Primero obtenemos el ID de la persona para luego eliminar el domicilio
  const [persona] = await pool.query('SELECT id, domicilio_id FROM personas WHERE curp = ?', [curp]);
  
  if (!persona[0]) {
    return 0;
  }

  // Iniciamos una transacción
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Eliminamos la persona
    const [resultPersona] = await connection.query('DELETE FROM personas WHERE id = ?', [persona[0].id]);
    
    // Eliminamos el domicilio asociado
    const [resultDomicilio] = await connection.query('DELETE FROM domicilios WHERE id = ?', [persona[0].domicilio_id]);
    
    await connection.commit();
    return resultPersona.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

}


module.exports = Persona;