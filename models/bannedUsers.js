const mongoose = require('mongoose');

const bannedUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
});

const BannedUser = mongoose.model('BannedUser', bannedUserSchema);

module.exports = BannedUser;
