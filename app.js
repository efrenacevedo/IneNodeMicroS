require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const personaRoutes = require('./routes/personaRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: "https://vistalibrosautores-production.up.railway.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // solo si usas cookies o headers protegidos
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Conectado a MongoDB"));


app.use("/api", authRoutes);


// Rutas
app.use('/api/personas', personaRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
  res.send(`Hola desde el puerto ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});