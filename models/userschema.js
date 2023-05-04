const mongoose = require("mongoose");

const userschema = mongoose.Schema({
  userID: String,
  userName: String,
  coins: { type: Number, default: 100 },
  bank: { type: Number,  default: 0 },
  job: { type: String, default: "unemployed" },
  workxp: { type: Number, default: 0 },
  passive: { type: String, default: "disabled" },
  inventory: [{ name: String, count: Number, itemType: String }], //its named as "itemType" instead of just "type" is because it is a reserved word in mongoose
  acceptedTos: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userschema);
console.log('UserSchema loaded')
