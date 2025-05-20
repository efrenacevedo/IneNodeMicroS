const Estado = require('../models/estadoModel');

exports.crearEstado = async (req, res) => {
  try {
    const estadoId = await Estado.create(req.body);
    res.status(201).json({ id: estadoId, message: 'Estado creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear estado', error: error.message });
  }
};

exports.obtenerEstados = async (req, res) => {
  try {
    const estados = await Estado.getAll();
    res.status(200).json(estados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estados' });
  }
};

exports.obtenerEstadoPorId = async (req, res) => {
  try {
    const estado = await Estado.getById(req.params.id);
    if (!estado) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }
    res.status(200).json(estado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estado' });
  }
};

exports.actualizarEstado = async (req, res) => {
  try {
    const affectedRows = await Estado.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }
    res.status(200).json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

exports.eliminarEstado = async (req, res) => {
  try {
    const affectedRows = await Estado.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }
    res.status(200).json({ message: 'Estado eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar estado' });
  }
};