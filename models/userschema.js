const mongoose = require("mongoose");

const userschema = mongoose.Schema({
  userID: String,
  userName: String,
  coins: { type: Number, default: 100 },
  bank: { type: Number,  default: 0 }
});

module.exports = mongoose.model("User", userschema);
console.log('UserSchema loaded')
