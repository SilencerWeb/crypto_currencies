const axios = require('axios');
const axiosRetry = require('axios-retry');

axiosRetry(axios);

const api = {
  getTickers: {
    bittrex: 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
    exmo: 'https://api.exmo.com/v1/ticker/',
    kraken: 'https://api.kraken.com/0/public/Ticker'
  }
};

module.exports = {
  getBittrexTickers: (req, res) => {
    return axios.get(api.getTickers.bittrex)
      .then((response) => {
        const { data: { result: tickersFromResponse } } = response;

        const tickersToSend = tickersFromResponse.map((ticker) => {
          const tickerName = ticker.MarketName.replace('-', '_');

          return {
            name: tickerName,
            buy: ticker.Bid,
            sell: ticker.Ask,
            high: ticker.High,
            low: ticker.Low,
            vol: ticker.Volume
          };
        });

        res.send(tickersToSend);
      });
  },

  getExmoTickers: (req, res) => {
    return axios.get(api.getTickers.exmo)
      .then((response) => {
        const { data: tickersFromResponse } = response;

        const tickersToSend = Object.keys(tickersFromResponse).map((tickerName) => {
          const ticker = tickersFromResponse[tickerName];

          return {
            name: tickerName,
            buy: ticker['buy_price'],
            sell: ticker['sell_price'],
            high: ticker.high,
            low: ticker.low,
            vol: ticker.vol
          };
        });

        res.send(tickersToSend);
      });
  },

  getKrakenTickers: (req, res) => {
    return axios.get('https://api.kraken.com/0/public/AssetPairs')
      .then((response) => {
        const { data: { result: assetPairs } } = response;

        const tickersName = [];
        const tickersBase = [];

        Object.keys(assetPairs).forEach((pairName) => {
          if (!~assetPairs[pairName].altname.indexOf('.d')) {
            tickersName.push(assetPairs[pairName].altname);
            tickersBase.push(assetPairs[pairName].base);
          }
        });

        axios.get(`${api.getTickers.kraken}?pair=${tickersName.join(',')}`)
          .then((response) => {
            const { data: { result: tickersFromResponse } } = response;

            const tickersToSend = Object.keys(tickersFromResponse).map((key, i) => {
              const ticker = tickersFromResponse[key];
              const tickerBase = tickersBase[i];

              const tickerName = key.replace(tickerBase, `${tickerBase}_`);

              return {
                name: tickerName,
                buy: ticker.b[0],
                sell: ticker.a[0],
                high: ticker.h[0],
                low: ticker.l[0],
                vol: ticker.v[0]
              };
            });

            res.send(tickersToSend);
          });
      });
  }
};