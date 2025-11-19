const mongoose = require("mongoose");

/**
 * Helper para asegurar que la conexión a MongoDB esté lista antes de hacer consultas
 * Esto previene errores de "buffering timed out" en Vercel Serverless Functions
 */
const ensureConnection = async () => {
  // Si ya está conectado, no hacer nada
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // Si está conectando, esperar hasta que termine (máximo 5 segundos)
  if (mongoose.connection.readyState === 2) {
    let attempts = 0;
    while (mongoose.connection.readyState === 2 && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    
    // Si después de esperar está conectado, retornar
    if (mongoose.connection.readyState === 1) {
      return true;
    }
  }

  // Si no está conectado, intentar reconectar
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    const connectDB = require("../config/database");
    await connectDB();
    
    // Esperar un poco después de conectar
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar que se conectó correctamente
    if (mongoose.connection.readyState === 1) {
      return true;
    }
  }

  // Si llegamos aquí, hay un problema
  throw new Error("No se pudo establecer conexión con MongoDB");
};

module.exports = { ensureConnection };

