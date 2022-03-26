const mongoose = require("mongoose");

const stockschema = mongoose.Schema({
  stockID: String,
  stockName: String,
  currentprice: Number,
  priceTable: [Number],
  changePercent: Number,
  volume: Number
});

module.exports = mongoose.model("Stock", stockschema);
console.log('StockSchema loaded');