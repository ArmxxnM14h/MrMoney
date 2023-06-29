async function updateStocks() {
  const stockschema = require('../models/stockschema');
  const stocks = await stockschema.find({});

  if (!stocks) {
    return console.log("No stocks found.");
  }

  stocks.forEach(stock => {
    const oldPrice = stock.currentPrice;

    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // Set the chance percentage for price increase over time
    const chanceUp = 0.5; // 60% chance of going up

    let changePercent;
    if (randomNumber < chanceUp) {
      // Generate a positive change percentage
      changePercent = Math.random() * 100;
    } else {
      // Set the change percentage to 0, so the price remains the same or slightly decreases
      changePercent = 0;
    }

    // Apply the change percentage to the old price to get the new price
    let newPrice = Math.round(oldPrice + (oldPrice * changePercent / 100));

    // Ensure the price doesn't reach 0
    if (newPrice <= 0) {
      newPrice = 1; // Set a minimum price of 1
    }

    stock.changePercent = changePercent;
    stock.changePercent = Math.round(stock.changePercent * 100) / 100;
    stock.currentPrice = newPrice;
    stock.priceTable.push(newPrice);

    // Adjust the stock's health based on the price change
    if (changePercent > 0) {
      stock.health = Math.min(100, stock.health + 1);
    } else if (changePercent < 0) {
      stock.health = Math.max(0, stock.health - 1);
    }

    stock.save().catch(err => console.log(err));
  });
}

setInterval(() => {
  updateStocks();
  global.stockLastUpdated = Date.now();
}, 300000);
