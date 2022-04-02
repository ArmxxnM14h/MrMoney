const stockschema = require("../models/stockschema.js");

function updateStocks() {
  stockschema.find({}, (err, res) => {
    if (err) console.log(err);

    if (!res) {
      console.log("No stocks found");
      return;
    }

    res.forEach(stock => {
      const stockID = stock.stockID;
      const stockName = stock.stockName;
      const currentPrice = stock.currentPrice;
      const priceTable = stock.priceTable;
      const changePercent = stock.changePercent;
      const volume = stock.volume;
      const health = stock.health;
      const volatility = stock.volatility;

      const newPrice = Math.floor(Math.random() * (currentPrice + volatility) + currentPrice - volatility);
      const newChangePercent = Math.floor((newPrice - currentPrice) / currentPrice * 100);
      const newVolume = Math.floor(Math.random() * (volume + volatility) + volume - volatility);
      const newHealth = Math.floor(Math.random() * (health + volatility) + health - volatility);

      stockschema.updateOne({
        stockID: stockID
      }, {
        $set: {
          currentPrice: newPrice,
          priceTable: [...priceTable, newPrice],
          changePercent: newChangePercent,
          volume: newVolume,
          health: newHealth
        }
      }, (err, res) => {
        if (err) console.log(err);

        if (!res) {
          console.log("No stocks found");
          return;
        }

        console.log(`${stockName} updated`);
      });
    });
  });
}