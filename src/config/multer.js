const multer = require("multer");
const path = require("path");

// Configuración para PORTADAS
const storagePortada = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/portadas/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = Date.now() + ext;
    cb(null, nombre);
  }
});

// Configuración para GALERÍA
const storageGaleria = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/galeria/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = Date.now() + "-" + Math.random() + ext;
    cb(null, nombre);
  }
});

module.exports = {
  uploadPortada: multer({ storage: storagePortada }),
  uploadGaleria: multer({ storage: storageGaleria })
};
