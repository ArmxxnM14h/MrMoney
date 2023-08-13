const mongoose = require('mongoose');

async function main() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect('mongodb://admin:armaanmiah2@144.172.80.146:1027/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Function to delete the stock collection
    async function deleteStockCollection() {
      try {
        await mongoose.connection.db.dropCollection('stocks');
        console.log('Stock collection deleted successfully.');
      } catch (error) {
        console.error('Error deleting stock collection:', error);
      }
    }

    // Call the function to delete the stock collection
    await deleteStockCollection();

    // Close the Mongoose connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the main function to initiate the process
main();