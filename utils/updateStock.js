const stockschema = require("../models/stockschema.js");

async function updateStocks() {
  const res = await stockschema.find({});

  if (!res) {
    return console.log("Maybe this might help https://www.youtube.com/watch?v=xvFZjo5PgG0");
  }

  res.forEach(stock => {
    const oldPrice = stock.currentPrice;
    const random = Math.random();
    let changePercent = 2 * stock.volatility * random;
    if (changePercent > stock.volatility) {
      changePercent -= 2 * stock.volatility;
    }
    changePercent = Math.min(changePercent, 100); // Limit changePercent to a maximum of 100

    const changeAmount = (oldPrice / 100) * changePercent;
    const maxChangeAmount = (oldPrice / 100) * 100; // Maximum change amount is 100% of the old price
    const newPrice = Math.round(oldPrice + Math.min(changeAmount, maxChangeAmount));

    stock.changePercent = (newPrice - oldPrice) / oldPrice * 100;
    stock.changePercent = Math.round(stock.changePercent * 100) / 100;

    stock.currentPrice = newPrice;
    stock.priceTable.push(newPrice);

    if (stock.health < 100 && newPrice >= oldPrice) {
      stock.health += 1;
    } else if (stock.health > 0 && newPrice < oldPrice) {
      stock.health -= 1;
    }

    stock.save().catch(err => console.log(err));
  });
}

setInterval(() => {
  updateStocks();
  global.stockLastUpdated = Date.now();
}, 150000);
