const Persona = require('../models/personaModel');
const Domicilio = require('../models/domicilioModel');
const SeccionElectoral = require('../models/seccionElectoralModel');

exports.crearPersona = async (req, res) => {
  try {
    // Validar referencias
    const { domicilioExists, seccionExists } = await Persona.validateReferences(
      req.body.domicilio_id,
      req.body.seccion_electoral_id
    );

    if (!domicilioExists || !seccionExists) {
      return res.status(400).json({
        message: 'Referencias inválidas',
        details: {
          domicilio: domicilioExists ? 'válido' : 'inválido',
          seccion_electoral: seccionExists ? 'válido' : 'inválido'
        }
      });
    }

    // Verificar unicidad de CURP e INE
    const curpExistente = await Persona.searchByCurp(req.body.curp);
    if (curpExistente) {
      return res.status(400).json({ message: 'El CURP ya está registrado' });
    }

    const ineExistente = await Persona.searchByIne(req.body.numero_ine);
    if (ineExistente) {
      return res.status(400).json({ message: 'El número de INE ya está registrado' });
    }

    const personaId = await Persona.create(req.body);
    res.status(201).json({ id: personaId, message: 'Persona creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear persona', error: error.message });
  }
};

exports.obtenerPersonas = async (req, res) => {
  try {
    const personas = await Persona.getAll();
    res.status(200).json(personas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener personas' });
  }
};

exports.obtenerPersonaPorId = async (req, res) => {
  try {
    const persona = await Persona.getById(req.params.id);
    if (!persona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json(persona);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener persona' });
  }
};

exports.actualizarPersona = async (req, res) => {
  try {
    // Validar referencias si se están actualizando
    if (req.body.domicilio_id || req.body.seccion_electoral_id) {
      const domicilio_id = req.body.domicilio_id || (await Persona.getById(req.params.id))?.domicilio_id;
      const seccion_electoral_id = req.body.seccion_electoral_id || (await Persona.getById(req.params.id))?.seccion_electoral_id;

      const { domicilioExists, seccionExists } = await Persona.validateReferences(
        domicilio_id,
        seccion_electoral_id
      );

      if (!domicilioExists || !seccionExists) {
        return res.status(400).json({
          message: 'Referencias inválidas',
          details: {
            domicilio: domicilioExists ? 'válido' : 'inválido',
            seccion_electoral: seccionExists ? 'válido' : 'inválido'
          }
        });
      }
    }

    // Verificar unicidad de CURP e INE si se están actualizando
    if (req.body.curp) {
      const personaConCurp = await Persona.searchByCurp(req.body.curp);
      if (personaConCurp && personaConCurp.id !== parseInt(req.params.id)) {
        return res.status(400).json({ message: 'El CURP ya está registrado para otra persona' });
      }
    }

    if (req.body.numero_ine) {
      const personaConIne = await Persona.searchByIne(req.body.numero_ine);
      if (personaConIne && personaConIne.id !== parseInt(req.params.id)) {
        return res.status(400).json({ message: 'El número de INE ya está registrado para otra persona' });
      }
    }

    const affectedRows = await Persona.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json({ message: 'Persona actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar persona' });
  }
};

exports.eliminarPersona = async (req, res) => {
  try {
    const affectedRows = await Persona.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json({ message: 'Persona eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar persona' });
  }
};

exports.buscarPorCurp = async (req, res) => {
  try {
    const persona = await Persona.searchByCurp(req.params.curp);
    if (!persona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json(persona);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar persona por CURP' });
  }
};

exports.buscarPorIne = async (req, res) => {
  try {
    const persona = await Persona.searchByIne(req.params.ine);
    if (!persona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json(persona);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar persona por INE' });
  }
};
exports.obtenerPersonasPorEstado = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.* 
      FROM personas p
      JOIN domicilios d ON p.domicilio_id = d.id
      JOIN estados e ON d.estado_id = e.id
      WHERE e.nombre LIKE ?
    `, [`%${req.params.estado}%`]);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar personas por estado' });
  }
};

exports.buscarPorNombre = async (req, res) => {
  try {
    const searchTerm = `%${req.params.nombre}%`;
    const [rows] = await pool.query(`
      SELECT * FROM personas 
      WHERE nombre LIKE ? 
         OR apellido_paterno LIKE ? 
         OR apellido_materno LIKE ?
    `, [searchTerm, searchTerm, searchTerm]);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar personas por nombre' });
  }
};

exports.eliminarPorNombre = async (req, res) => {
  try {
    const searchTerm = `%${req.params.nombre}%`;
    const [result] = await pool.query(`
      DELETE FROM personas 
      WHERE nombre LIKE ? 
         OR apellido_paterno LIKE ? 
         OR apellido_materno LIKE ?
    `, [searchTerm, searchTerm, searchTerm]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontraron personas con ese nombre' });
    }
    
    res.status(200).json({ 
      message: `${result.affectedRows} persona(s) eliminada(s) exitosamente` 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar personas por nombre' });
  }
};

exports.eliminarPorCurp = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM personas WHERE curp = ?',
      [req.params.curp]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró persona con ese CURP' });
    }
    
    res.status(200).json({ message: 'Persona eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar persona por CURP' });
  }
};