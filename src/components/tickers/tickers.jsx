import React from 'react';

import { TickersTable } from 'components/tickers/tickers-table';
import { Button } from 'components/button/button';

import { exchangesApi } from 'helpers/api/exchanges-api';

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
      }
    ],
    availableCurrencies: [
      'BTC',
      'ETH',
      'USDT',
      'USD',
      'RUB',
      'UAH'
    ],
    tickers: []
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

  updateTickersControls = () => {
    const exchanges = this.state.exchanges;

    exchanges.forEach((exchange, i) => {
      const tickersControls = exchanges[i].tickersControls;

      exchanges[i].tickers.forEach((ticker) => {
        ticker.name.split('_').forEach((currency) => {
          tickersControls.every((tickersControl) => {
            return tickersControl.name !== currency;
          }) && this.state.availableCurrencies.some((availableCurrency) => {
            return currency === availableCurrency;
          }) && tickersControls.push({
            name: currency,
            isActive: false
          });
        });
      });

      exchanges[i].tickersControls = tickersControls;
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
    const activeTickersControl = tickersControls.map((tickersControl) => {
      return tickersControl.isActive ? tickersControl.name : null;
    }).join('');

    const tickers = activeTickersControl && activeTickersControl.toLocaleLowerCase() !== 'all' ?
      exchanges[activeExchangeIndex].tickers.filter((ticker) => {
        return ~ticker.name.toLowerCase().indexOf(activeTickersControl.toLowerCase());
      }) : exchanges[activeExchangeIndex].tickers;

    this.setState({
      tickers: tickers
    }, () => {
      this.sortTickers(exchanges[activeExchangeIndex].sort.category, exchanges[activeExchangeIndex].sort.direction);
    });
  };

  loadTickers = (componentDidMount = false) => {
    const exchanges = this.state.exchanges;
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    Promise.resolve()
      .then(() => {
        if (componentDidMount) {
          const promises = exchanges.map((exchange, i) => {
            return exchangesApi(exchange.name, 'getTickers')
              .then((json) => {
                return exchanges[i].tickers = json;
              });
          });

          return Promise.all(promises);
        } else {
          return exchangesApi(exchanges[activeExchangeIndex].name, 'getTickers')
            .then((json) => {
              exchanges[activeExchangeIndex].tickers = json;
            });
        }
      })
      .then(() => {
        this.setState({
          exchanges: exchanges
        }, () => {
          if (componentDidMount) {
            this.updateTickersControls();
          }

          this.updateTickers();
        });
      });
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
    this.loadTickers(true);

    this.loadTickersInterval = setInterval(this.loadTickers, 3000);
  };

  componentWillUnmount = () => {
    clearInterval(this.loadTickersInterval);
  };

  render() {
    const exchangeControls = (
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
        { exchangeControls }
        { activeExchange }
        { tickersControls }
        { tickersTable }
      </div>
    );
  }
}

export { Tickers };