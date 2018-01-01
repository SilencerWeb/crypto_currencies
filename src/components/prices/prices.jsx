import React from 'react';

import { PricesControl } from 'components/prices/prices-control';
import { PricesTable } from 'components/prices/prices-table';

import { api } from 'helpers/api/api';

class Prices extends React.Component {
  state = {
    exchanges: [
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
          category: 'name',
          type: 'down'
        },
        isActive: true
      },
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
          category: 'name',
          type: 'down'
        },
        isActive: false
      }
    ],
    tickers: []
  };

  sortTickers = (category, type) => {
    const exchanges = this.state.exchanges;
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    const tickers = this.state.tickers;

    tickers.sort((ticker1, ticker2) => {
      ticker1 = isNaN(+ticker1) ? ticker1 : +ticker1;
      ticker2 = isNaN(+ticker2) ? ticker2 : +ticker2;

      if (type === 'down') {
        return ticker1[category] < ticker2[category] ? 1 : -1;
      } else {
        return ticker1[category] > ticker2[category] ? 1 : -1;
      }
    });

    exchanges[activeExchangeIndex].sort = {
      category: category,
      type: type
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
    });

    this.sortTickers(exchanges[activeExchangeIndex].sort.category, exchanges[activeExchangeIndex].sort.type);
  };

  loadTickers = () => {
    const exchanges = this.state.exchanges;
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    api(exchanges[activeExchangeIndex].name, 'getTickers')
      .then((json) => {
        exchanges[activeExchangeIndex].tickers = json;

        this.setState({
          exchanges: exchanges
        });

        this.updateCurrencies();
        this.updateTickers();
      });
  };

  onPriceControlClick = (e) => {
    const exchanges = this.state.exchanges;

    if (e.target.dataset.type === 'exchange') {
      exchanges.forEach((exchange) => {
        return exchange.isActive = exchange.name === e.target.dataset.control;
      });
    } else {
      const activeExchangeIndex = exchanges.findIndex((exchange) => {
        return exchange.isActive;
      });

      exchanges[activeExchangeIndex].currencies.forEach((currency) => {
        return currency.isActive = currency.name === e.target.dataset.control;
      });
    }

    this.setState({
      exchanges: exchanges,
      tickers: []
    });

    this.updateTickers();
  };

  onSortButtonClick = (e) => {
    this.sortTickers(e.target.dataset.category, e.target.dataset.type);
  };

  componentDidMount() {
    this.loadTickers();

    setInterval(this.loadTickers, 1500);
  }

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

    const pricesTable = <PricesTable tickers={ this.state.tickers } onClick={ this.onSortButtonClick }/>;

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