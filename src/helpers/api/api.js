import * as exmo from 'helpers/api/exmo';
import * as bittrex from 'helpers/api/bittrex';
import * as kraken from 'helpers/api/kraken';

/* Ticker template:
  CURR_CURR: {
    name: String,
    buy: Number,
    sell: Number,
    high: Number,
    low: Number,
    vol: Number
  }
*/

const api = (exchange, method) => {
  switch (exchange) {
    case 'exmo':
      return exmo[method]();
    case 'bittrex':
      return bittrex[method]();
    case 'kraken':
      return kraken[method]();
  }
};

export { api };