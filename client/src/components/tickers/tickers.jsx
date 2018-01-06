import React from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { TickersTable } from 'components/tickers/tickers-table';
import { Button } from 'components/button/button';

axiosRetry(axios);

class Tickers extends React.Component {
  state = {
    exchanges: [
      {
        name: 'bittrex',
        tickers: [],
        tickersControls: [],
        sort: {
          category: '',
          direction: ''
        },
        isActive: true
      },
      {
        name: 'exmo',
        tickers: [],
        tickersControls: [],
        sort: {
          category: '',
          direction: ''
        },
        isActive: false
      },
      {
        name: 'kraken',
        tickers: [],
        tickersControls: [],
        sort: {
          category: '',
          direction: ''
        },
        isActive: false
      }
    ],
    tickers: [],
    availableTickersControls: [
      'favorite',
      'all',
      'BTC',
      'ETH',
      'USDT',
      'USD',
      'RUB',
      'UAH'
    ],
    defaultTickersControls: [
      'favorite',
      'all'
    ]
  };

  sortTickers = (category, direction) => {
    const exchanges = this.state.exchanges;
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    const tickers = this.state.tickers.sort((ticker1, ticker2) => {
      const category1 = +ticker1[category];
      const category2 = +ticker2[category];

      if (direction === 'down') {
        return category2 - category1;
      } else if (direction === 'up') {
        return category1 - category2;
      }
    });

    exchanges[activeExchangeIndex].sort = {
      category: category,
      direction: direction
    };

    this.setState({
      exchanges: exchanges,
      tickers: tickers
    });
  };

  updateTickersControls = (updateExchangeIndex) => {
    const exchanges = this.state.exchanges;
    const exchangeIndex = updateExchangeIndex ? updateExchangeIndex : exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    const tickersControls = exchanges[exchangeIndex].tickersControls;

    exchanges[exchangeIndex].tickers.forEach((ticker) => {
      const tickerCurrencies = ticker.name.split('_');
      const possibleTickersControls = [
        ...this.state.defaultTickersControls,
        ...tickerCurrencies
      ];

      possibleTickersControls.forEach((possibleTickerControl) => {
        const isNew = tickersControls.every((tickersControl) => {
          return tickersControl.name !== possibleTickerControl;
        });

        if (isNew) {
          const isAvailable = this.state.availableTickersControls.some((availableCurrency) => {
            return possibleTickerControl === availableCurrency;
          });

          isAvailable && tickersControls.push({
            name: possibleTickerControl,
            isActive: false
          });
        }
      });

      exchanges[exchangeIndex].tickersControls = tickersControls;
    });

    this.setState({
      exchanges: exchanges
    });
  };

  updateTickers = () => {
    const exchanges = this.state.exchanges;
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    const tickersControls = exchanges[activeExchangeIndex].tickersControls;
    const activeTickersControl = tickersControls.find((tickersControl) => {
      return tickersControl.isActive;
    });

    const tickers = activeTickersControl && activeTickersControl.name.toLowerCase() !== 'all' ?
      exchanges[activeExchangeIndex].tickers.filter((ticker) => {
        return ~ticker.name.toLowerCase().indexOf(activeTickersControl.name.toLowerCase());
      }) : exchanges[activeExchangeIndex].tickers;

    this.setState({
      tickers: tickers
    }, () => {
      this.sortTickers(exchanges[activeExchangeIndex].sort.category, exchanges[activeExchangeIndex].sort.direction);
    });
  };

  loadTickers = (loadExchangeIndex) => {
    const exchanges = this.state.exchanges;
    const exchangeIndex = loadExchangeIndex ? loadExchangeIndex : exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    return axios.get(`/api/${ exchanges[exchangeIndex].name}/getTickers`)
      .then((json) => {
        exchanges[exchangeIndex].tickers = json.data;
      })
      .then(() => {
        this.setState({
          exchanges: exchanges
        }, () => {
          if (!exchanges[exchangeIndex].tickersControls.length) {
            this.updateTickersControls(exchangeIndex);
          }

          this.updateTickers();
        });
      });
  };

  loadAllTickers = () => {
    const exchanges = this.state.exchanges;

    return Promise.all(exchanges.map((exchange, i) => {
      if (!exchange.tickers.length) {
        return this.loadTickers(i);
      }
    }));
  };

  onExchangeControlClick = (e) => {
    const exchanges = this.state.exchanges;

    exchanges.forEach((exchange) => {
      return exchange.isActive = exchange.name === e.target.dataset.control;
    });

    this.setState({
      exchanges: exchanges,
      tickers: []
    }, () => {
      this.updateTickers();
    });
  };

  onTickersControlClick = (e) => {
    const exchanges = this.state.exchanges;
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    exchanges[activeExchangeIndex].tickersControls.forEach((currency) => {
      return currency.isActive = currency.name === e.target.dataset.control;
    });

    this.setState({
      exchanges: exchanges,
      tickers: []
    }, () => {
      this.updateTickers();
    });
  };

  componentDidMount = () => {
    this.loadTickers()
      .then(() => {
        return this.loadAllTickers();
      })
      .then(() => {
        this.loadTickersInterval = setInterval(this.loadTickers, 3000);
      });
  };

  componentWillUnmount = () => {
    clearInterval(this.loadTickersInterval);
  };

  render() {
    const exchangesControls = (
      <div>
        { this.state.exchanges.map((exchange) => {
          return (
            <Button
              className="btn btn-primary"
              data-control={ exchange.name }
              key={ exchange.name }
              onClick={ !exchange.isActive ? this.onExchangeControlClick : null }>
              { exchange.name }
            </Button>
          );
        }) }
      </div>
    );

    const activeExchange = this.state.exchanges.map((exchange) => {
      return exchange.isActive ? <h1 key={ exchange.name }>{ exchange.name }</h1> : null;
    });

    const tickersControls = (
      <div>
        { this.state.exchanges.map((exchange) => {
          return exchange.isActive ? exchange.tickersControls.map((tickersControl) => {
            return (
              <Button
                className="btn btn-primary"
                data-control={ tickersControl.name }
                key={ tickersControl.name }
                onClick={ !tickersControl.isActive ? this.onTickersControlClick : null }>
                { tickersControl.name }
              </Button>
            );
          }) : null;
        }) }
      </div>
    );

    const tickersTable = <TickersTable tickers={ this.state.tickers } onSortDirectionClick={ this.sortTickers }/>;

    return (
      <div>
        { exchangesControls }
        { activeExchange }
        { tickersControls }
        { tickersTable }
      </div>
    );
  }
}

export { Tickers };