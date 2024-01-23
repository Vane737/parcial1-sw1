const mongoose = require('mongoose');

const userSalasSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  salas_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sala'
  }
});

const UserSalas = mongoose.model('UserSalas', userSalasSchema);

module.exports = UserSalas;