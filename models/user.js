const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, unique: true, maxLength: 100 },
  password: { type: String, required: true, maxLength: 100 },
  profile_picture: { type: String },
  bio: { type: String, maxLength: 10000 },
  created_at: { type: Date, default: Date.now },
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
