require("./connectToMongo.js");
const schema = require("./models/stockschema.js");

const newDoc = new schema({
  stockID: "MC",
  stockName: "Monke Coin",
  currentprice: 10,
  priceTable: [0],
  changePercent: 0,
  volume: 0
});
newDoc.save().catch(err => console.log(err));