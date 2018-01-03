import * as exmo from 'helpers/api/exchanges/exmo';
import * as bittrex from 'helpers/api/exchanges/bittrex';
import * as kraken from 'helpers/api/exchanges/kraken';

/*
Ticker template:
  CURR_CURR: {
    name: String,
    buy: Number,
    sell: Number,
    high: Number,
    low: Number,
    vol: Number
  }
*/

const exchangesApi = (exchange, method) => {
  switch (exchange) {
    case 'exmo':
      return exmo[method]();
    case 'bittrex':
      return bittrex[method]();
    case 'kraken':
      return kraken[method]();
  }
};

export { exchangesApi };