const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');

// CRUD básico
router.post('/', personaController.crearPersona);
router.get('/', personaController.obtenerPersonas);
router.get('/id/:id', personaController.obtenerPersonaPorId);
router.put('/id/:id', personaController.actualizarPersona);
router.delete('/id/:id', personaController.eliminarPersona);

// Búsquedas específicas
router.get('/curp/:curp', personaController.buscarPorCurp);
router.get('/ine/:ine', personaController.buscarPorIne);
router.get('/nombre/:nombre', personaController.buscarPorNombre);
router.get('/estado/:estado', personaController.obtenerPersonasPorEstado);

// Eliminaciones alternativas
router.delete('/nombre/:nombre', personaController.eliminarPorNombre);
router.delete('/curp/:curp', personaController.eliminarPorCurp);

module.exports = router;