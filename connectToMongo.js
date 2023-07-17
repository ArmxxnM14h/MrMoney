const mongoose = require('mongoose');
const mongoURL = 'mongodb://admin:armaanmiah2@144.172.80.146:1027/';

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Mongoose connected');
}).catch((error) => {
    console.log('Mongo has either disconnected/not connected')
    console.log(error)
  }
)
