const express = require('express');
const axios = require('axios');
const axiosRetry = require('axios-retry');

axiosRetry(axios, { retries: 3 });

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/bittrex/gettickers', (req, res) => {
  axios.get('https://bittrex.com/api/v1.1/public/getmarketsummaries')
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

      res.send(tickers);
    });
});

app.get('/api/exmo/gettickers', (req, res) => {
  axios.get('https://api.exmo.com/v1/ticker/')
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

      res.send(tickers);
    });
});

app.get('/api/kraken/gettickers', (req, res) => {
  axios.get('https://api.kraken.com/0/public/AssetPairs')
    .then((response) => {
      return response.data.result;
    })
    .then((assetPairs) => {
      const assetPairsName = Object.keys(assetPairs);

      const tickersName = [];
      const tickersBase = [];

      assetPairsName.forEach((pairName) => {
        if (!~assetPairs[pairName].altname.indexOf('.d')) {
          tickersName.push(assetPairs[pairName].altname);
          tickersBase.push(assetPairs[pairName].base);
        }
      });

      axios.get(`https://api.kraken.com/0/public/Ticker?pair=${tickersName.join(',')}`)
        .then((response) => {
          const tickers = Object.keys(response.data.result).map((key, i) => {
            const ticker = response.data.result[key];
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

          res.send(tickers);
        });
    });
});

app.listen(port);