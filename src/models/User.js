const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  tokenU: {
    type: String
  }
});

userSchema.statics.findOneByCorreo = function (correo) {
  return this.findOne({ correo });
};

userSchema.statics.findById = function (id) {
  return this.findOne({ _id: id });
};

const User = mongoose.model('User', userSchema);

module.exports = User;