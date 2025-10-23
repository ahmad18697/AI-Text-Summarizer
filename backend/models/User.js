const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String }, // optional for Google users
    googleId: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
