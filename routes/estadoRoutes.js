const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estadoController');

// CRUD básico
router.post('/', estadoController.crearEstado);
router.get('/', estadoController.obtenerEstados);
router.get('/id/:id', estadoController.obtenerEstadoPorId);
router.put('/id/:id', estadoController.actualizarEstado);
router.delete('/id/:id', estadoController.eliminarEstado);

// Búsqueda por nombre
router.get('/nombre/:nombre', estadoController.buscarPorNombre);

module.exports = router;