const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  usuarioId: String,
  productos: [String], // IDs de productos
  total: Number,
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
