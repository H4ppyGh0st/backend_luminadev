const express = require("express");
const cors = require("cors");
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

// Configuración de CORS
// Permitir peticiones desde el frontend en desarrollo y producción
const allowedOrigins = [
  'http://localhost:4000',           // React dev server (puerto por defecto)
  'http://localhost:4001',           // React dev server (puerto alternativo)
  'http://localhost:3000',           // React dev server (puerto alternativo)
  'http://localhost:3001',           // React dev server (puerto alternativo)
  'https://lumina-dev-hrh2.vercel.app', // Frontend en producción (Vercel)
  // Puedes agregar más orígenes aquí si tienes múltiples deployments
];

// Si hay una variable de entorno con orígenes adicionales, agregarlos
if (process.env.FRONTEND_URL) {
  const frontendUrls = process.env.FRONTEND_URL.split(',').map(url => url.trim());
  allowedOrigins.push(...frontendUrls);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Si el origen está en la lista de permitidos, permitirlo
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // En desarrollo, permitir cualquier origen localhost
      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        callback(null, true);
      } 
      // Permitir cualquier subdominio de vercel.app (para diferentes deployments)
      else if (origin.includes('.vercel.app')) {
        callback(null, true);
      } 
      else {
        // En producción, solo permitir orígenes específicos
        console.warn(`Origen bloqueado por CORS: ${origin}`);
        callback(new Error('No permitido por CORS'));
      }
    }
  },
  credentials: true, // Permitir cookies y headers de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Esto hace que /uploads/products/imagen.png sea accesible desde el navegador
// Usar ruta absoluta para asegurar que funcione correctamente
const uploadsStaticPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsStaticPath));

// Usar las rutas definidas
app.use("/", routes);

// Puerto
const PORT = process.env.PORT || 4000;

// Iniciar servidor solo si no estamos en Vercel (serverless)
// En Vercel, exportamos la app directamente
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}

// Exportar para Vercel Serverless Functions
module.exports = app;
