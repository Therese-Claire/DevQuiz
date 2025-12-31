const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  totalScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
