const mongoose = require('mongoose');

const userCredentialsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('UserCredentials', userCredentialsSchema);