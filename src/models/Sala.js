const mongoose = require('mongoose');

const salaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  xml: {
    type: String
  },
  description: {
    type: String
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  tokenS: {
    type: String
  }
});

// Método para obtener todas las salas de un usuario específico
salaSchema.statics.findByUserId = function (userId) {
  return this.find({ user_id: userId });
};

// Método para obtener todas las relaciones de usuario-sala para un usuario específico
salaSchema.statics.findUserSalasByUserId = function (userId) {
  return UserSalas.find({ user_id: userId });
};

// Método para eliminar todas las relaciones de usuario-sala para una sala específica
salaSchema.statics.deleteUserSalasBySalaId = async function (salaId) {
  await UserSalas.deleteMany({ salas_id: salaId });
};

// Método para eliminar una sala por su ID
salaSchema.statics.deleteSalaById = async function (salaId) {
  await this.deleteUserSalasBySalaId(salaId);
  return this.findByIdAndDelete(salaId);
};

// Método para obtener una sala por su ID
salaSchema.statics.findSalaById = function (salaId) {
  return this.findById(salaId);
};

const Sala = mongoose.model('Sala', salaSchema);

module.exports = Sala;