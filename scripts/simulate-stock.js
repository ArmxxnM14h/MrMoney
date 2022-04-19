const Chart = require('quickchart-js');
const volatility = 10;
const startingPrice = 10;
const sampleSize = 100;
let stockPrices = [];

function getNewStockPrice(oldPrice) {
  const random = Math.random();
  let changePercent = 2 * volatility * random;
  if (changePercent > volatility) {
    changePercent -= (2 * volatility);
  }
  const changeAmount = (oldPrice / 100) * changePercent;
  return newPrice = oldPrice + changeAmount;
}

const initialPrice = getNewStockPrice(startingPrice);
stockPrices.push(Math.round(initialPrice));

for (let i = 0; i < sampleSize; i++) {
  const newPrice = getNewStockPrice(stockPrices[i]);
  stockPrices.push(Math.round(newPrice));
}

const chart = new Chart();
chart
  .setConfig({
    type: 'line',
    data: {
      labels: stockPrices.map((_, i) => i),
      datasets: [
        { 
          label: "Price", 
          data: stockPrices
        }
      ] 
    },
  })
  .setWidth(800)
  .setHeight(400)
  .setBackgroundColor('white');

console.log(stockPrices);
chart.getShortUrl().then(console.log);

