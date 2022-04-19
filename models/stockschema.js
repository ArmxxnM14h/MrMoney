const mongoose = require("mongoose");

const stockschema = mongoose.Schema({
  stockID: String,
  stockName: String,
  currentPrice: Number,
  priceTable: [Number],
  changePercent: Number,
  volume: Number,
  health: Number,
  volatility: Number
});

module.exports = mongoose.model("Stock", stockschema);
console.log('StockSchema loaded');