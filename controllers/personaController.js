const Persona = require('../models/personaModel');

exports.crearPersona = async (req, res) => {
  try {
    const personaId = await Persona.create(req.body);
    res.status(201).json({ id: personaId, message: 'Persona creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear persona' });
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


exports.actualizarPersonaPorCurp = async (req, res) => {
  try {
    const affectedRows = await Persona.updateByCurp(req.params.curp, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json({ message: 'Persona actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar persona' });
  }
};

exports.eliminarPersonaPorCurp = async (req, res) => {
  try {
    const affectedRows = await Persona.deleteByCurp(req.params.curp);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json({ message: 'Persona eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar persona' });
  }
};

exports.obtenerPersonaPorCurp = async (req, res) => {
  try {
    const persona = await Persona.getByCurp(req.params.curp);
    if (!persona) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json(persona);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener persona' });
  }
};
