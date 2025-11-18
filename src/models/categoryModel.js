const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
});

module.exports = mongoose.model("Category", categorySchema);
