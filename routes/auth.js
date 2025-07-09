const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registro
router.post("/register", async (req, res) => {
  const { username, password, securityQuestion, securityAnswer } = req.body;

  if (!username || !password || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

  try {
    await User.create({
      username,
      password: hashedPassword,
      securityQuestion,
      securityAnswer: hashedAnswer,
    });
    res.json({ message: "Usuario creado" });
  } catch (err) {
    res.status(400).json({ error: "Nombre de usuario ya existe o error en la base" });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
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
