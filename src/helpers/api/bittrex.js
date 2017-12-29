import axios from 'axios';
import axiosRetry from 'axios-retry';

import { axiosRetriesCount } from 'helpers/constants';

axiosRetry(axios, { retries: axiosRetriesCount });

const api = {
  getTickers: 'https://bittrex.com/api/v1.1/public/getmarketsummaries'
};

const getTickers = () => {
  return axios.get(api.getTickers)
    .then((response) => {
      let tickers = [];

      response.data.result.forEach((ticker) => {
        const tickerName = ticker.MarketName.replace('-', '_');

        tickers.push({
          name: tickerName,
          buy: ticker.Bid,
          sell: ticker.Ask,
          high: ticker.High,
          low: ticker.Low,
          vol: ticker.Volume
        });
      });

      return tickers;
    });
};

export { getTickers };