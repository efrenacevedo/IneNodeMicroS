const SeccionElectoral = require('../models/seccionElectoralModel');
const Municipio = require('../models/municipioModel');

exports.crearSeccionElectoral = async (req, res) => {
  try {
    // Validar que el municipio exista
    const municipioExists = await Municipio.exists(req.body.municipio_id);
    if (!municipioExists) {
      return res.status(400).json({ message: 'El municipio especificado no existe' });
    }

    const seccionId = await SeccionElectoral.create(req.body);
    res.status(201).json({ id: seccionId, message: 'Sección electoral creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear sección electoral', error: error.message });
  }
};

exports.obtenerSeccionesPorMunicipio = async (req, res) => {
  try {
    const secciones = await SeccionElectoral.getByMunicipio(req.params.municipioId);
    res.status(200).json(secciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener secciones electorales' });
  }
};

exports.obtenerSeccionPorId = async (req, res) => {
  try {
    const seccion = await SeccionElectoral.getById(req.params.id);
    if (!seccion) {
      return res.status(404).json({ message: 'Sección electoral no encontrada' });
    }
    res.status(200).json(seccion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener sección electoral' });
  }
};

exports.actualizarSeccionElectoral = async (req, res) => {
  try {
    // Validar que el municipio exista si se está actualizando
    if (req.body.municipio_id) {
      const municipioExists = await Municipio.exists(req.body.municipio_id);
      if (!municipioExists) {
        return res.status(400).json({ message: 'El municipio especificado no existe' });
      }
    }

    const affectedRows = await SeccionElectoral.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Sección electoral no encontrada' });
    }
    res.status(200).json({ message: 'Sección electoral actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar sección electoral' });
  }
};

exports.eliminarSeccionElectoral = async (req, res) => {
  try {
    const affectedRows = await SeccionElectoral.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Sección electoral no encontrada' });
    }
    res.status(200).json({ message: 'Sección electoral eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar sección electoral' });
  }
};