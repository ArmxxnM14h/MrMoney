const Stock = require('../models/stockschema');
async function deleteStockData() {
    try {
      await Stock.deleteMany({});
      console.log('All stock data deleted successfully.');
    } catch (error) {
      console.error('Error deleting stock data:', error);
    }
  }
  
  // Call the function to delete stock data
  deleteStockData();