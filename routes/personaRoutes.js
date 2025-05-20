const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');

// CRUD para personas
router.post('/', personaController.crearPersona);
router.get('/', personaController.obtenerPersonas);
router.get('/:id', personaController.obtenerPersonaPorId);
router.put('/:id', personaController.actualizarPersona);
router.delete('/:id', personaController.eliminarPersona);
router.get('/curp/:curp', personaController.obtenerPersonaPorCurp);
router.delete('/curp/:curp', personaController.eliminarPersonaPorCurp);

module.exports = router;