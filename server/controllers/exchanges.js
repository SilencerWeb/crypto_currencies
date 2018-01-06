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

        const tickersNames = [];
        const tickersBases = [];
        const tickersQuotes = [];

        Object.keys(assetPairs).forEach((pairName) => {
          if (!~assetPairs[pairName].altname.indexOf('.d')) {
            tickersNames.push(assetPairs[pairName].altname);
            tickersBases.push(assetPairs[pairName].base);
            tickersQuotes.push(assetPairs[pairName].quote);
          }
        });

        axios.get(`${api.getTickers.kraken}?pair=${tickersNames.join(',')}`)
          .then((response) => {
            const { data: { result: tickersFromResponse } } = response;

            const tickersToSend = Object.keys(tickersFromResponse).map((key, i) => {
              const ticker = tickersFromResponse[key];
              
              const tickerBase = tickersBases[i][0] === 'X' || tickersBases[i][0] === 'Z' ?
                tickersBases[i].slice(1) : tickersBases[i];
              const tickerQuote = tickersQuotes[i][0] === 'X' || tickersQuotes[i][0] === 'Z' ?
                tickersQuotes[i].slice(1) : tickersQuotes[i];

              const tickerName = `${tickerBase}_${tickerQuote}`;

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