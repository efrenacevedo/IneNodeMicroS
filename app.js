require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Importar rutas
const personaRoutes = require('./routes/personaRoutes');
const domicilioRoutes = require('./routes/domicilioRoutes');
const estadoRoutes = require('./routes/estadoRoutes');
const municipioRoutes = require('./routes/municipioRoutes');
const seccionElectoralRoutes = require('./routes/seccionElectoralRoutes');

// Configuración básica de la aplicación
const app = express();

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por IP
  message: 'Demasiadas peticiones desde esta IP, por favor intenta nuevamente más tarde'
});

// Middlewares
app.use(helmet()); // Seguridad básica
app.use(cors()); // Habilitar CORS
app.use(morgan('dev')); // Logging de peticiones
app.use(bodyParser.json()); // Parsear JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parsear formularios
app.use(limiter); // Aplicar rate limiting a todas las rutas

// Configuración de rutas
// Usar rutas
app.use('/api/personas', personaRoutes);


// Ruta de verificación de salud
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'El servicio de personas está funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenido al Microservicio de Gestión de Personas',
    endpoints: {
      personas: '/api/personas',
      
    },
    documentation: 'Url host:  https://inenodemicroservice.onrender.com'
  });
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `La ruta ${req.originalUrl} no existe`,
    method: req.method
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor de personas corriendo en el puerto ${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Documentación: http://localhost:${PORT}`);
});

module.exports = app; // Para testing