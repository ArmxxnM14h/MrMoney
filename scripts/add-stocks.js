require("../connectToMongo.js");
const schema = require("../models/stockschema.js");

const newDoc = new schema({
  stockID: "MC",
  stockName: "Monke Coin",
  currentprice: 10,
  priceTable: [0, 10],
  changePercent: 0,
  volume: 0,
  health: 100,
  volatility: 3
});
newDoc.save().catch(err => console.log(err)).then(() => {
  console.log("Added Monke Coin to database");
  process.exit();
});
