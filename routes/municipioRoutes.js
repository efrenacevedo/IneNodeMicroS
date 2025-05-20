const express = require('express');
const router = express.Router();
const municipioController = require('../controllers/municipioController');

// CRUD básico
router.post('/', municipioController.crearMunicipio);
router.get('/estado/:estadoId', municipioController.obtenerMunicipiosPorEstado);
router.get('/id/:id', municipioController.obtenerMunicipioPorId);
router.put('/id/:id', municipioController.actualizarMunicipio);
router.delete('/id/:id', municipioController.eliminarMunicipio);

// Búsqueda por nombre
router.get('/nombre/:nombre', municipioController.buscarPorNombre);

module.exports = router;