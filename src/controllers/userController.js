const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Registro
exports.register = async (req, res) => {
  try {
    const { ensureConnection } = require("../utils/dbHelper");
    await ensureConnection();
    
    const { nombre, correo, contraseña } = req.body;

    // Validar campos
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear nuevo usuario
    const newUser = new User({
      nombre,
      correo,
      contraseña: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
    }

    // Normalizar datos de entrada (trim y lowercase para el correo)
    const correoNormalizado = correo.trim().toLowerCase();
    const contraseñaNormalizada = contraseña.trim();

    // Credenciales quemadas para administrador
    const ADMIN_EMAIL = "admin@lumina.com";
    const ADMIN_PASSWORD = "admin123";

    // Verificar credenciales de administrador quemadas (PRIMERO, antes de buscar en BD)
    if (correoNormalizado === ADMIN_EMAIL.toLowerCase() && contraseñaNormalizada === ADMIN_PASSWORD) {
      return res.json({
        mensaje: "Login exitoso",
        usuario: {
          id: "admin-hardcoded",
          nombre: "Administrador",
          correo: ADMIN_EMAIL,
          rol: "administrador",
        },
      });
    }

    // Verificar conexión antes de buscar usuario
    const { ensureConnection } = require("../utils/dbHelper");
    await ensureConnection();
    
    // Buscar usuario en la base de datos
    const user = await User.findOne({ correo: correoNormalizado });
    if (!user) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const validPassword = await bcrypt.compare(contraseñaNormalizada, user.contraseña);
    if (!validPassword) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // Login exitoso
    res.json({
      mensaje: "Login exitoso",
      usuario: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol || "usuario", // Por defecto "usuario" si no tiene rol
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener todos los usuarios (solo para administradores)
exports.getUsers = async (req, res) => {
  try {
    const { ensureConnection } = require("../utils/dbHelper");
    await ensureConnection();
    
    const users = await User.find().select("-contraseña").lean(); // Excluir contraseñas
    res.json(users);
  } catch (error) {
    console.error("Error en getUsers:", error);
    res.status(500).json({ 
      mensaje: error.message || "Error al obtener usuarios",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Crear usuario (desde administración)
exports.createUser = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    // Validar campos
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ mensaje: "Nombre, correo y contraseña son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo: correo.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear nuevo usuario
    const newUser = new User({
      nombre,
      correo: correo.trim().toLowerCase(),
      contraseña: hashedPassword,
      rol: rol || "usuario", // Por defecto "usuario" si no se especifica
    });

    await newUser.save();

    // Devolver usuario sin contraseña
    const userResponse = newUser.toObject();
    delete userResponse.contraseña;

    res.status(201).json({ mensaje: "Usuario creado exitosamente", usuario: userResponse });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, contraseña, rol } = req.body;

    // Buscar usuario
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Actualizar campos
    if (nombre) user.nombre = nombre;
    if (correo) {
      // Verificar que el correo no esté en uso por otro usuario
      const existingUser = await User.findOne({ 
        correo: correo.trim().toLowerCase(),
        _id: { $ne: id } // Excluir el usuario actual
      });
      if (existingUser) {
        return res.status(400).json({ mensaje: "El correo ya está en uso por otro usuario" });
      }
      user.correo = correo.trim().toLowerCase();
    }
    if (contraseña) {
      // Encriptar nueva contraseña
      user.contraseña = await bcrypt.hash(contraseña, 10);
    }
    if (rol) user.rol = rol;

    await user.save();

    // Devolver usuario sin contraseña
    const userResponse = user.toObject();
    delete userResponse.contraseña;

    res.json({ mensaje: "Usuario actualizado exitosamente", usuario: userResponse });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
