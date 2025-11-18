const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rutas de usuarios
router.get("/", userController.getUsers);           // Listar usuarios
router.post("/register", userController.register);  // Registrar usuario
router.post("/login", userController.login);        // Iniciar sesión
router.post("/", userController.createUser);       // Crear usuario (admin)
router.put("/:id", userController.updateUser);     // Actualizar usuario (admin)
router.delete("/:id", userController.deleteUser);   // Eliminar usuario (admin)

module.exports = router;
