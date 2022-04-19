const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://MrMoney:armaanmiah2@cluster0.hrd5w.mongodb.net/Economy?retryWrites=true&w=majority", function() {
  mongoose.connection.db.dropDatabase().then(() => { console.log("Database Wiped...") }).catch(err => console.log(err));
})