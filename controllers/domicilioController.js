const Domicilio = require('../models/domicilioModel');
const Municipio = require('../models/municipioModel');
const Estado = require('../models/estadoModel');

exports.crearDomicilio = async (req, res) => {
  try {
    // Validar referencias
    const { municipioExists, estadoExists } = await Domicilio.validateReferences(
      req.body.municipio_id,
      req.body.estado_id
    );

    if (!municipioExists || !estadoExists) {
      return res.status(400).json({
        message: 'Referencias inválidas',
        details: {
          municipio: municipioExists ? 'válido' : 'inválido',
          estado: estadoExists ? 'válido' : 'inválido'
        }
      });
    }

    const domicilioId = await Domicilio.create(req.body);
    res.status(201).json({ id: domicilioId, message: 'Domicilio creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear domicilio', error: error.message });
  }
};

exports.obtenerDomicilioPorId = async (req, res) => {
  try {
    const domicilio = await Domicilio.getById(req.params.id);
    if (!domicilio) {
      return res.status(404).json({ message: 'Domicilio no encontrado' });
    }
    res.status(200).json(domicilio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener domicilio' });
  }
};

exports.actualizarDomicilio = async (req, res) => {
  try {
    // Validar referencias si se están actualizando
    if (req.body.municipio_id || req.body.estado_id) {
      const municipio_id = req.body.municipio_id || (await Domicilio.getById(req.params.id))?.municipio_id;
      const estado_id = req.body.estado_id || (await Domicilio.getById(req.params.id))?.estado_id;

      const { municipioExists, estadoExists } = await Domicilio.validateReferences(
        municipio_id,
        estado_id
      );

      if (!municipioExists || !estadoExists) {
        return res.status(400).json({
          message: 'Referencias inválidas',
          details: {
            municipio: municipioExists ? 'válido' : 'inválido',
            estado: estadoExists ? 'válido' : 'inválido'
          }
        });
      }
    }

    const affectedRows = await Domicilio.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Domicilio no encontrado' });
    }
    res.status(200).json({ message: 'Domicilio actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar domicilio' });
  }
};

exports.eliminarDomicilio = async (req, res) => {
  try {
    const affectedRows = await Domicilio.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Domicilio no encontrado' });
    }
    res.status(200).json({ message: 'Domicilio eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar domicilio' });
  }
};