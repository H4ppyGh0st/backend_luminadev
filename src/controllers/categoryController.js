const Category = require("../models/categoryModel");

// Obtener todas las categorías
exports.getCategories = async (req, res) => {
  try {
    const { ensureConnection } = require("../utils/dbHelper");
    await ensureConnection();
    
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (error) {
    console.error("Error en getCategories:", error);
    res.status(500).json({ 
      mensaje: error.message || "Error al obtener categorías",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Crear categoría
exports.createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validar campos
    if (!nombre) {
      return res.status(400).json({ mensaje: "El nombre de la categoría es obligatorio" });
    }

    // Verificar si la categoría ya existe
    const existingCategory = await Category.findOne({ nombre: nombre.trim() });
    if (existingCategory) {
      return res.status(400).json({ mensaje: "La categoría ya existe" });
    }

    // Crear nueva categoría
    const newCategory = new Category({
      nombre: nombre.trim(),
      descripcion: descripcion || "",
    });

    await newCategory.save();
    res.status(201).json({ mensaje: "Categoría creada exitosamente", categoria: newCategory });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar categoría
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    // Buscar categoría
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    // Verificar que el nombre no esté en uso por otra categoría
    if (nombre) {
      const existingCategory = await Category.findOne({ 
        nombre: nombre.trim(),
        _id: { $ne: id }
      });
      if (existingCategory) {
        return res.status(400).json({ mensaje: "El nombre de categoría ya está en uso" });
      }
      category.nombre = nombre.trim();
    }

    if (descripcion !== undefined) {
      category.descripcion = descripcion;
    }

    await category.save();
    res.json({ mensaje: "Categoría actualizada exitosamente", categoria: category });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar categoría
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.json({ mensaje: "Categoría eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

