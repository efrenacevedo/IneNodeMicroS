const pool = require('../config/db');

class ValidationService {
  static async validateReferences(table, id) {
    try {
      const [rows] = await pool.query(`SELECT id FROM ${table} WHERE id = ?`, [id]);
      return rows.length > 0;
    } catch (error) {
      console.error(`Error validando referencia en tabla ${table}:`, error);
      return false;
    }
  }

  static async validateMultipleReferences(references) {
    const validationResults = {};
    const validationPromises = [];
    
    // Preparar todas las promesas de validación
    for (const [table, id] of Object.entries(references)) {
      validationPromises.push(
        this.validateReferences(table, id)
          .then(exists => { validationResults[table] = exists; })
      );
    }
    
    // Esperar a que todas las validaciones terminen
    await Promise.all(validationPromises);
    
    return validationResults;
  }
}

module.exports = ValidationService;