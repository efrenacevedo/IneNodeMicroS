const express = require('express');
const router = express.Router();
const seccionElectoralController = require('../controllers/seccionElectoralController');

// CRUD básico
router.post('/', seccionElectoralController.crearSeccionElectoral);
router.get('/municipio/:municipioId', seccionElectoralController.obtenerSeccionesPorMunicipio);
router.get('/id/:id', seccionElectoralController.obtenerSeccionPorId);
router.put('/id/:id', seccionElectoralController.actualizarSeccionElectoral);
router.delete('/id/:id', seccionElectoralController.eliminarSeccionElectoral);

// Búsquedas especiales
router.get('/numero/:numero', seccionElectoralController.buscarPorNumero);
router.get('/distrito/:distrito', seccionElectoralController.buscarPorDistrito);

module.exports = router;