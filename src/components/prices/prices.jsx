import React from 'react';

import { PricesControl } from 'components/prices/prices-control';
import { PricesTable } from 'components/prices/prices-table';

import { exchangesApi } from 'helpers/api/exchanges-api';

class Prices extends React.Component {
  state = {
    exchanges: [
      {
        name: 'bittrex',
        tickers: [],
        currencies: [
          {
            name: 'all',
            isActive: true
          }
        ],
        sort: {
          category: '',
          direction: ''
        },
        isActive: true
      },
      {
        name: 'exmo',
        tickers: [],
        currencies: [
          {
            name: 'all',
            isActive: true
          }
        ],
        sort: {
          category: '',
          direction: ''
        },
        isActive: false
      },
      {
        name: 'kraken',
        tickers: [],
        currencies: [
          {
            name: 'all',
            isActive: true
          }
        ],
        sort: {
          category: '',
          direction: ''
        },
        isActive: false
      }
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

  updateCurrencies = () => {
    const exchanges = this.state.exchanges;
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    const currencies = exchanges[activeExchangeIndex].currencies;

    exchanges[activeExchangeIndex].tickers.forEach((ticker) => {
      ticker.name.split('_').forEach((tickerCurrency) => {
        currencies.every((currency) => {
          return currency.name !== tickerCurrency;
        }) && currencies.push({
          name: tickerCurrency,
          isActive: false
        });
      });
    });

    exchanges[activeExchangeIndex].currencies = currencies;

    this.setState({
      exchanges: exchanges
    });
  };

  updateTickers = () => {
    const exchanges = this.state.exchanges;
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    const currencies = exchanges[activeExchangeIndex].currencies;
    const activeCurrencyName = currencies.map((currency) => {
      return currency.isActive ? currency.name : null;
    }).join('');

    const tickers = activeCurrencyName && activeCurrencyName !== 'all' ?
      exchanges[activeExchangeIndex].tickers.filter((ticker) => {
        return ~ticker.name.toLowerCase().indexOf(activeCurrencyName.toLowerCase());
      }) : exchanges[activeExchangeIndex].tickers;

    this.setState({
      tickers: tickers
    }, () => {
      this.sortTickers(exchanges[activeExchangeIndex].sort.category, exchanges[activeExchangeIndex].sort.direction);
    });
  };

  loadTickers = () => {
    const exchanges = this.state.exchanges;
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    exchangesApi(exchanges[activeExchangeIndex].name, 'getTickers')
      .then((json) => {
        exchanges[activeExchangeIndex].tickers = json;

        this.setState({
          exchanges: exchanges
        }, () => {
          this.updateCurrencies();
          this.updateTickers();
        });
      });
  };

  onPriceControlClick = (control, type) => {
    const exchanges = this.state.exchanges;

    if (type === 'exchange') {
      exchanges.forEach((exchange) => {
        return exchange.isActive = exchange.name === control;
      });
    } else if (type === 'currency') {
      const activeExchangeIndex = exchanges.findIndex((exchange) => {
        return exchange.isActive;
      });

      exchanges[activeExchangeIndex].currencies.forEach((currency) => {
        return currency.isActive = currency.name === control;
      });
    }

    this.setState({
      exchanges: exchanges,
      tickers: []
    }, () => {
      const activeExchange = this.state.exchanges.find((exchange) => {
        return exchange.isActive;
      });

      if (activeExchange.tickers.length) {
        this.updateTickers();
      } else {
        this.loadTickers();
      }
    });
  };

  componentDidMount = () => {
    this.loadTickers();

    this.loadTickersInterval = setInterval(this.loadTickers, 1500);
  };

  componentWillUnmount = () => {
    clearInterval(this.loadTickersInterval);
  };

  render() {
    const pricesExchanges = (
      <div>
        { this.state.exchanges.map((exchange) => {
          return (
            <PricesControl
              name={ exchange.name }
              type="exchange"
              key={ exchange.name }
              onClick={ !exchange.isActive ? this.onPriceControlClick : null }/>
          );
        }) }
      </div>
    );

    const pricesActiveExchange = this.state.exchanges.map((exchange) => {
      return exchange.isActive ? <h1 key={ exchange.name }>{ exchange.name }</h1> : null;
    });

    const pricesActiveExchangeControls = (
      <div>
        { this.state.exchanges.map((exchange) => {
          return exchange.isActive ? exchange.currencies.map((currency) => {
            return (
              <PricesControl
                name={ currency.name }
                type="currency"
                key={ currency.name }
                onClick={ !currency.isActive ? this.onPriceControlClick : null }/>
            );
          }) : null;
        }) }
      </div>
    );

    const pricesTable = <PricesTable tickers={ this.state.tickers } onSortTypeButtonClick={ this.sortTickers }/>;

    return (
      <div>
        { pricesExchanges }
        { pricesActiveExchange }
        { pricesActiveExchangeControls }
        { pricesTable }
      </div>
    );
  }
}

export { Prices };