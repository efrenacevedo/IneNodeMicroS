const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');

// Obtener todas las personas
router.get('/', personaController.obtenerPersonas);

// Obtener persona por ID
router.get('/id/:id', personaController.obtenerPersonaPorId);

// Obtener personas por estado (nombre del estado)
router.get('/estado/:estado', personaController.obtenerPersonasPorEstado);

// Obtener persona por CURP
router.get('/curp/:curp', personaController.buscarPorCurp);

// Obtener persona por número de INE
router.get('/ine/:ine', personaController.buscarPorIne);

// Buscar personas por nombre (puede ser nombre, apellido paterno o materno)
router.get('/buscar/:nombre', personaController.buscarPorNombre);

// Crear nueva persona
router.post('/', personaController.crearPersona);

// Actualizar persona por ID
router.put('/:id', personaController.actualizarPersona);

// Eliminar persona por ID
router.delete('/id/:id', personaController.eliminarPersona);

// Eliminar persona por nombre (coincidencia parcial)
router.delete('/nombre/:nombre', personaController.eliminarPorNombre);

// Eliminar persona por CURP
router.delete('/curp/:curp', personaController.eliminarPorCurp);

module.exports = router;