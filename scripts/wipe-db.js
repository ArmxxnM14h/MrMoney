const mongoose = require('mongoose');

async function wipeDatabase() {
  try {
    await mongoose.connect("mongodb://admin:armxxn34@144.172.80.145:25565/", { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();
    console.log("Database Wiped...");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

wipeDatabase();