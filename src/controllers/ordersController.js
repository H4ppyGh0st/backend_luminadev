const Order = require("../models/orderModel");

// Crear una nueva orden
exports.createOrder = async (req, res) => {
  try {
    const { usuarioId, productos, total } = req.body;

    if (!usuarioId || !productos || !Array.isArray(productos)) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }

    const nuevaOrden = new Order({
      usuarioId,
      productos,
      total,
    });

    await nuevaOrden.save();

    res.status(201).json({
      mensaje: "Orden creada exitosamente",
      orden: nuevaOrden,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la orden", error });
  }
};

// Obtener TODAS las órdenes
exports.getOrders = async (req, res) => {
  try {
    const { ensureConnection } = require("../utils/dbHelper");
    await ensureConnection();
    
    const orders = await Order.find().lean();
    res.json(orders);
  } catch (error) {
    console.error("Error en getOrders:", error);
    res.status(500).json({ 
      mensaje: "Error al obtener las órdenes",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Obtener órdenes de un usuario por ID
exports.getOrdersByUser = async (req, res) => {
  try {
    const { ensureConnection } = require("../utils/dbHelper");
    await ensureConnection();
    
    const { usuarioId } = req.params;
    const orders = await Order.find({ usuarioId }).lean();

    res.json(orders);
  } catch (error) {
    console.error("Error en getOrdersByUser:", error);
    res.status(500).json({ 
      mensaje: "Error al obtener órdenes del usuario",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Obtener una sola orden por ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ mensaje: "Orden no encontrada" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la orden", error });
  }
};

// Eliminar una orden por ID
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ mensaje: "Orden no encontrada" });
    }

    res.json({ mensaje: "Orden eliminada", orden: deleted });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la orden", error });
  }
};
