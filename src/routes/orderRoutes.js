const express = require("express");
const router = express.Router();
const orderController = require("../controllers/ordersController");

// Crear una nueva orden
router.post("/", orderController.createOrder);

// Obtener todas las órdenes
router.get("/", orderController.getOrders);

// Obtener órdenes de un usuario
router.get("/usuario/:usuarioId", orderController.getOrdersByUser);

// Obtener una orden por ID
router.get("/:id", orderController.getOrderById);

// Eliminar una orden por ID
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
