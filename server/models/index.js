const mongoose = require('mongoose');
const axios = require('axios');
const axiosRetry = require('axios-retry');
const {
  exchanges: exchanges
} = require('../controllers');

axiosRetry(axios);

const EXCHANGES = [
  'bittrex',
  'exmo',
  'kraken'
];

const db = mongoose.connection;

db.once('open', function () {
  const Schema = mongoose.Schema;

  const tickerSchema = new Schema({
    name: String,
    buy: Number,
    sell: Number,
    high: Number,
    low: Number,
    vol: Number,
    exchange: String,
    date: Date
  });
  const Ticker = mongoose.model('Ticker', tickerSchema);

  db.db.dropDatabase();  

  setInterval(() => {
    EXCHANGES.forEach((exchange) => {
      exchanges[exchange].getTickers()
        .then((tickersFromResponse) => {
          tickersFromResponse.forEach((ticker) => {
            new Ticker({
              ...ticker,
              exchange: exchange,
              date: new Date().toLocaleString().slice(0, -3)
            }).save();
          });
        });
    });
  }, 60000);
});

mongoose.connect('mongodb://127.0.0.1:27017');

module.exports = db;