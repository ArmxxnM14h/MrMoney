//EDIT THIS
const stockProperties = {
  initialPrice: 100,
  volatility: 0.2,
  timePeriod: 1,
  numIntervals: 99
}

const Chart = require("quickchart-js");

function simulateStockPrice(initialPrice, volatility, timePeriod, numIntervals) {
  // Calculate the drift rate based on an annual expected return of 5%
  const drift = 0.05 / 365;

  // Calculate the length of each time interval
  const dt = timePeriod / numIntervals;

  // Initialize the current stock price and the price history
  let currentPrice = initialPrice;
  const priceHistory = [currentPrice];

  // Simulate the stock price for each time interval
  for (let i = 0; i < numIntervals; i++) {
    // Generate a random number from a normal distribution
    const epsilon = randomNormal();

    // Calculate the change in the stock price for this interval
    const deltaS = currentPrice * (drift * dt + volatility * epsilon * Math.sqrt(dt));

    // Update the current stock price and add it to the price history
    currentPrice += deltaS;
    priceHistory.push(currentPrice);
  }

  return priceHistory;
}

function randomNormal() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

stockPrices = simulateStockPrice(stockProperties.initialPrice, stockProperties.volatility, stockProperties.timePeriod, stockProperties.numIntervals);

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

