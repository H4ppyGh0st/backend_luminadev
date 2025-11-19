const mongoose = require("mongoose");

// Configurar Mongoose para evitar timeouts de buffering
mongoose.set('bufferCommands', false); // Desactivar buffering para evitar timeouts
// Nota: bufferMaxEntries ya no es una opción válida en versiones recientes de Mongoose

const connectDB = async () => {
  try {
    // Configuración de opciones para MongoDB con timeouts aumentados
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 segundos para seleccionar servidor
      socketTimeoutMS: 45000, // 45 segundos para operaciones de socket
      connectTimeoutMS: 30000, // 30 segundos para conectar
      maxPoolSize: 10, // Mantener hasta 10 conexiones en el pool
      minPoolSize: 1, // Mantener al menos 1 conexión
      retryWrites: true,
      w: 'majority',
      appName: 'LuminaDev'
      // Nota: bufferMaxEntries y bufferCommands ya no son opciones válidas en versiones recientes de Mongoose
      // El buffering se controla automáticamente con bufferCommands: false configurado arriba
    };

    const conn = await mongoose.connect(
      "mongodb+srv://celisdaniel_db_user:YLdZ92Vj1uIeQ132@luminadev.th8npud.mongodb.net/?retryWrites=true&w=majority&appName=LuminaDev",
      options
    );
    
    console.log("✅ Conectado a MongoDB:", conn.connection.host);
    
    // Manejar eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error("❌ Error de MongoDB:", err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn("⚠️ MongoDB desconectado");
    });
    
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    // En producción, no lanzar el error para evitar que la función falle completamente
    // pero sí loguearlo para debugging
    if (process.env.NODE_ENV === 'production') {
      console.error("⚠️ Continuando sin conexión a BD (modo degradado)");
    } else {
      throw error;
    }
  }
};

module.exports = connectDB;
