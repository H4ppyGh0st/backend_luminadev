const express = require("express");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/database");
const routes = require("./routes");

const User = require("./models/userModel");
const Product = require("./models/productModel");
const Order = require("./models/orderModel");
const Category = require("./models/categoryModel");
const Cart = require("./models/cartModel");

const app = express();

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

connectDB();


app.use(express.json());

// Esto hace que /uploads/products/imagen.png sea accesible desde el navegador
// Usar ruta absoluta para asegurar que funcione correctamente
const uploadsStaticPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsStaticPath));

// Usar las rutas definidas
app.use("/", routes);

// Puerto
const PORT = process.env.PORT || 4000;

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
