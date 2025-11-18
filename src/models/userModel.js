const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  contraseña: String,
  rol: String,
});

module.exports = mongoose.model("User", userSchema);
