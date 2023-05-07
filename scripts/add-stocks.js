require("../connectToMongo.js");
const schema = require("../models/stockschema.js");

const newDoc1 = new schema({
  stockID: "CG",
  stockName: "Cyborg",
  currentPrice: 100,
  priceTable: [0, 100],
  changePercent: 0,
  volume: 0,
  health: 100,
  volatility: 3
});
newDoc1.save().catch(err => console.log(err)).then(() => {
  console.log("Added Cyborg to database");
});

const newDoc2 = new schema({
  stockID: "UM",
  stockName: "Urainium",
  currentPrice: 20,
  priceTable: [0, 20],
  changePercent: 0,
  volume: 0,
  health: 100,
  volatility: 10
});
newDoc2.save().catch(err => console.log(err)).then(() => {
  console.log("Added Urainium to database");
});

const newDoc3 = new schema({
  stockID: "AO",
  stockName: "Aloo",
  currentPrice: 50,
  priceTable: [0, 50],
  changePercent: 0,
  volume: 0,
  health: 100,
  volatility: 8
});
newDoc3.save().catch(err => console.log(err)).then(() => {
  console.log("Added Aloo to database");
});

const newDoc4 = new schema({
  stockID: "LC",
  stockName: "Lunarcoin",
  currentPrice: 200,
  priceTable: [0, 200],
  changePercent: 0,
  volume: 0,
  health: 100,
  volatility: 5
});
newDoc4.save().catch(err => console.log(err)).then(() => {
  console.log("Added Lunarcoins to database");
});

