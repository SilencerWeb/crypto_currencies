import axios from 'axios';
import axiosRetry from 'axios-retry';

import { axiosRetriesCount } from 'helpers/constants';

axiosRetry(axios, { retries: axiosRetriesCount });

const api = {
  getAssetPairs: 'https://api.kraken.com/0/public/AssetPairs',
  getTicker: 'https://api.kraken.com/0/public/Ticker'
};

const getAssetPairs = () => {
  return axios.get(api.getAssetPairs)
    .then((response) => {
      return response.data.result;
    });
};

const getTickers = () => {
  return getAssetPairs().then((assetPairs) => {
    const tickers = [];
    const assetPairsName = Object.keys(assetPairs);

    assetPairsName.forEach((pairName) => {
      const tickerName = assetPairs[pairName].altname;
      const tickerBase = assetPairs[pairName].base;

      !~tickerName.indexOf('.d') ?
        axios.get(api.getTicker + '?pair=' + tickerName)
          .then((response) => {
            const ticker = response.data.result[Object.keys(response.data.result)[0]];
            const formattedTickerName = tickerBase[0] === 'X' ?
              tickerName.replace(tickerBase.slice(1), `${tickerBase.slice(1)}_`)
              : tickerName.replace(tickerBase, `${tickerBase}_`);

            tickers.push({
              name: formattedTickerName,
              buy: ticker.b[0],
              sell: ticker.a[0],
              high: ticker.h[0],
              low: ticker.l[0],
              vol: ticker.v[0]
            });
          }) : null;
    });

    return tickers;
  });
};

export { getTickers };