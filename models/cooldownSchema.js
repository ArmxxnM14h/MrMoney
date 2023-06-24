const mongoose = require('mongoose');

const cooldownSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  command: { type: String, required: true },
  cooldownExpires: { type: Date, required: true },
});

module.exports = mongoose.model("Cooldown", cooldownSchema);
console.log('Loaded Cooldowns.')
