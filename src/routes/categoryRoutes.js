const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Rutas de categorías
router.get("/", categoryController.getCategories);           // Listar categorías
router.post("/", categoryController.createCategory);         // Crear categoría
router.put("/:id", categoryController.updateCategory);       // Actualizar categoría
router.delete("/:id", categoryController.deleteCategory);    // Eliminar categoría

module.exports = router;

