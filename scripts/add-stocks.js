require("../connectToMongo.js");
const schema = require("../models/stockschema.js");

const newDoc1 = new schema({
  stockID: "MC",
  stockName: "Monke Coin",
  currentPrice: 100,
  priceTable: [0, 100],
  changePercent: 0,
  volume: 0,
  health: 100,
  volatility: 3
});
newDoc1.save().catch(err => console.log(err)).then(() => {
  console.log("Added Monke Coin to database");
});

const newDoc2 = new schema({
  stockID: "WSB",
  stockName: "Wall Stop",
  currentPrice: 20,
  priceTable: [0, 20],
  changePercent: 0,
  volume: 0,
  health: 100,
  volatility: 10
});
newDoc2.save().catch(err => console.log(err)).then(() => {
  console.log("Added Wall Stop to database");
});

const newDoc3 = new schema({
  stockID: "GC",
  stockName: "Galaxy Coin",
  currentPrice: 50,
  priceTable: [0, 50],
  changePercent: 0,
  volume: 0,
  health: 100,
  volatility: 8
});
newDoc3.save().catch(err => console.log(err)).then(() => {
  console.log("Added Galaxy Coin to database");
});

const newDoc4 = new schema({
  stockID: "IC",
  stockName: "Innovation Coin",
  currentPrice: 200,
  priceTable: [0, 200],
  changePercent: 0,
  volume: 0,
  health: 100,
  volatility: 5
});
newDoc4.save().catch(err => console.log(err)).then(() => {
  console.log("Added Innovation Coin to database");
});

