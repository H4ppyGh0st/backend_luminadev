const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  usuarioId: String,
  productos: [String], // IDs de productos
  total: Number,
});

module.exports = mongoose.model("Cart", cartSchema);
