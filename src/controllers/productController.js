const productsModel = require("../models/productModel");

// ===================
// SUBIR IMAGEN PORTADA
// ===================
exports.uploadPortada = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No se envió ninguna imagen" });

    return res.json({ portada: req.file.filename });

  } catch (error) {
    res.status(500).json({ message: "Error subiendo portada" });
  }
};

exports.uploadGaleria = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No se enviaron imágenes" });

    const nombres = req.files.map((file) => file.filename);
    return res.json({ galeria: nombres });

  } catch (error) {
    res.status(500).json({ message: "Error subiendo galería" });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Si hay archivos subidos, agregar los nombres de archivo
    if (req.files) {
      if (req.files.portada && req.files.portada[0]) {
        productData.portada = req.files.portada[0].filename;
      }
      if (req.files.imagenes && req.files.imagenes.length > 0) {
        productData.galeria = req.files.imagenes.map(file => file.filename);
      }
    }
    
    // Convertir precio a número si viene como string
    if (productData.precio) {
      productData.precio = parseFloat(productData.precio);
    }
    
    // Convertir cantidad a número si viene como string
    if (productData.cantidad !== undefined) {
      productData.cantidad = parseInt(productData.cantidad) || 0;
    }
    
    const product = new productsModel(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error al crear el producto" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await productsModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Si hay archivos subidos, agregar los nombres de archivo
    if (req.files) {
      if (req.files.portada && req.files.portada[0]) {
        updateData.portada = req.files.portada[0].filename;
      }
      if (req.files.imagenes && req.files.imagenes.length > 0) {
        updateData.galeria = req.files.imagenes.map(file => file.filename);
      }
    }
    
    // Convertir precio a número si viene como string
    if (updateData.precio) {
      updateData.precio = parseFloat(updateData.precio);
    }
    
    // Convertir cantidad a número si viene como string
    if (updateData.cantidad !== undefined) {
      updateData.cantidad = parseInt(updateData.cantidad) || 0;
    }
    
    const product = await productsModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await productsModel.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
