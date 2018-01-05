const {
  exchanges: exchanges
} = require('../controllers');

module.exports = app => {
  app.get('/api/bittrex/gettickers', exchanges.getBittrexTickers);
  app.get('/api/exmo/gettickers', exchanges.getExmoTickers);
  app.get('/api/kraken/gettickers', exchanges.getKrakenTickers);
};