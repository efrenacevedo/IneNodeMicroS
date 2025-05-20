const Municipio = require('../models/municipioModel');
const Estado = require('../models/estadoModel');

exports.crearMunicipio = async (req, res) => {
  try {
    // Validar que el estado exista
    const estadoExists = await Estado.exists(req.body.estado_id);
    if (!estadoExists) {
      return res.status(400).json({ message: 'El estado especificado no existe' });
    }

    const municipioId = await Municipio.create(req.body);
    res.status(201).json({ id: municipioId, message: 'Municipio creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear municipio', error: error.message });
  }
};

exports.obtenerMunicipiosPorEstado = async (req, res) => {
  try {
    const municipios = await Municipio.getByEstado(req.params.estadoId);
    res.status(200).json(municipios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener municipios' });
  }
};

exports.obtenerMunicipioPorId = async (req, res) => {
  try {
    const municipio = await Municipio.getById(req.params.id);
    if (!municipio) {
      return res.status(404).json({ message: 'Municipio no encontrado' });
    }
    res.status(200).json(municipio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener municipio' });
  }
};

exports.actualizarMunicipio = async (req, res) => {
  try {
    // Validar que el estado exista si se está actualizando
    if (req.body.estado_id) {
      const estadoExists = await Estado.exists(req.body.estado_id);
      if (!estadoExists) {
        return res.status(400).json({ message: 'El estado especificado no existe' });
      }
    }

    const affectedRows = await Municipio.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Municipio no encontrado' });
    }
    res.status(200).json({ message: 'Municipio actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar municipio' });
  }
};

exports.eliminarMunicipio = async (req, res) => {
  try {
    const affectedRows = await Municipio.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Municipio no encontrado' });
    }
    res.status(200).json({ message: 'Municipio eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar municipio' });
  }
};