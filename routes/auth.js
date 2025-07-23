const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registro
router.post("/register", async (req, res) => {
  const { username, password, securityQuestion, securityAnswer } = req.body;

  console.log("🔹 Intentando registrar usuario:", username);

  if (!username || !password || !securityQuestion || !securityAnswer) {
    console.log("❌ Faltan campos");
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("⚠️ Usuario ya existente en la base:", username);
      return res.status(409).json({ error: "El nombre de usuario ya está en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      securityQuestion,
      securityAnswer: hashedAnswer,
    });

    await newUser.save();
    console.log("✅ Usuario creado exitosamente:", newUser.username);

    res.status(201).json({ message: "Usuario creado" });

  } catch (err) {
    console.error("🔥 Error durante el registro:", err);
    res.status(500).json({ error: "Error interno al registrar usuario" });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // 🔐 Generar token
    const payload = {
      id: user._id
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // 👈 Asegúrate de que coincide con el backend de ASP.NET
      {
        issuer: "miapp.jwt",   // 👈 Mismo issuer que en appsettings.json
        expiresIn: "1M"        // 👈 1 hora de validez
      }
    );

    // (Opcional) refreshtoken: podrías generar uno aquí si lo usarás luego
    // const refreshToken = jwt.sign(...)

    res.json({
      token,
      expiration: Date.now() + 60000, // 1 hora en ms
      refreshToken: null // si aún no usas refreshToken
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener pregunta de seguridad
router.post("/get-question", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

  res.json({ securityQuestion: user.securityQuestion });
});

// Cambiar contraseña
router.post("/reset-password", async (req, res) => {
  const { username, answer, newPassword } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

  const answerMatch = await bcrypt.compare(answer, user.securityAnswer);
  if (!answerMatch) return res.status(400).json({ error: "Respuesta incorrecta" });

  const hashedNewPass = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPass;
  await user.save();
  res.json({ message: "Contraseña actualizada" });
});

module.exports = router;
