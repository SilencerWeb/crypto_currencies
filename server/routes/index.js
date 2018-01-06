const EXCHANGES = [
  'bittrex',
  'exmo',
  'kraken'
];

const {
  exchanges: exchanges
} = require('../controllers');

module.exports = app => {
  EXCHANGES.forEach((exchange) => {
    app.get(`/api/${exchange}/getTickers`, (req, res) => {
      exchanges[exchange].getTickers().then((tickers) => res.send(tickers));
    });
  });
};