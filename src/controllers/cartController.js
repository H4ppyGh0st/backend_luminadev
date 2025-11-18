const Cart = require("../models/cartModel");

// Crear carrito (si no existe)
exports.createCart = async (req, res) => {
  try {
    const { usuarioId } = req.body;

    // Verificar si ya existe un carrito del usuario
    const existing = await Cart.findOne({ usuarioId });
    if (existing) {
      return res.status(400).json({ message: "El usuario ya tiene un carrito" });
    }

    const cart = new Cart({
      usuarioId,
      productos: [],
      total: 0,
    });

    await cart.save();
    res.status(201).json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener carrito por usuario
exports.getCartByUser = async (req, res) => {
  try {
    const cart = await Cart.findOne({ usuarioId: req.params.usuarioId });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar un producto al carrito
exports.addProduct = async (req, res) => {
  try {
    const { usuarioId, productoId, precio } = req.body;

    const cart = await Cart.findOne({ usuarioId });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.productos.push(productoId);

    // Recalcular total
    cart.total = cart.total + precio;

    await cart.save();
    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un producto del carrito
exports.removeProduct = async (req, res) => {
  try {
    const { usuarioId, productoId, precio } = req.body;

    const cart = await Cart.findOne({ usuarioId });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.productos = cart.productos.filter(id => id !== productoId);

    // Recalcular total
    cart.total = cart.total - precio;
    if (cart.total < 0) cart.total = 0;

    await cart.save();
    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vaciar carrito
exports.clearCart = async (req, res) => {
  try {
    const { usuarioId } = req.body;

    const cart = await Cart.findOne({ usuarioId });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.productos = [];
    cart.total = 0;

    await cart.save();
    res.json({ message: "Carrito vaciado", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar carrito completo
exports.deleteCart = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const cart = await Cart.findOneAndDelete({ usuarioId });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json({ message: "Carrito eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
