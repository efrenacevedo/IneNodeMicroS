const express = require('express');
const router = express.Router();
const domicilioController = require('../controllers/domicilioController');

// CRUD básico
router.post('/', domicilioController.crearDomicilio);
router.get('/id/:id', domicilioController.obtenerDomicilioPorId);
router.put('/id/:id', domicilioController.actualizarDomicilio);
router.delete('/id/:id', domicilioController.eliminarDomicilio);

// Búsquedas por referencia
router.get('/municipio/:municipioId', domicilioController.obtenerDomiciliosPorMunicipio);
router.get('/estado/:estadoId', domicilioController.obtenerDomiciliosPorEstado);

module.exports = router;