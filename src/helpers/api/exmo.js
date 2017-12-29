import axios from 'axios';
import axiosRetry from 'axios-retry';

import { axiosRetriesCount } from 'helpers/constants';

axiosRetry(axios, { retries: axiosRetriesCount });

const api = {
  getTickers: 'https://api.exmo.com/v1/ticker/'
};

const getTickers = () => {
  return axios.get(api.getTickers)
    .then((response) => {
      let tickers = [];

      Object.keys(response.data).forEach((tickerName) => {
        let ticker = response.data[tickerName];

        tickers.push({
          name: tickerName,
          buy: ticker['buy_price'],
          sell: ticker['sell_price'],
          high: ticker.high,
          low: ticker.low,
          vol: ticker.vol
        });
      });

      return tickers;
    });
};

export { getTickers };