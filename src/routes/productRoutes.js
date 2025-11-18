const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Asegurar que el directorio de uploads existe
const uploadsDir = path.join(__dirname, "../../uploads/products");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Asegurar que el directorio existe antes de guardar
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  }
}).fields([
  { name: "portada", maxCount: 1 },
  { name: "imagenes", maxCount: 5 },
]);

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'El archivo es demasiado grande. Máximo 5MB.' });
    }
    return res.status(400).json({ message: `Error al subir archivo: ${err.message}` });
  }
  if (err) {
    console.error("Error en multer:", err);
    return res.status(500).json({ message: 'Error al procesar el archivo' });
  }
  next();
};

router.post("/", upload, handleMulterError, productController.createProduct);

router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

router.put("/:id", upload, handleMulterError, productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
