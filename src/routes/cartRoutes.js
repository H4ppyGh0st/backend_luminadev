const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Crear carrito
router.post("/", cartController.createCart);

// Obtener carrito de un usuario
router.get("/:usuarioId", cartController.getCartByUser);

// Agregar producto al carrito
router.post("/add", cartController.addProduct);

// Quitar producto del carrito
router.post("/remove", cartController.removeProduct);

// Vaciar carrito
router.post("/clear", cartController.clearCart);

// Eliminar carrito completo
router.delete("/:usuarioId", cartController.deleteCart);

module.exports = router;
