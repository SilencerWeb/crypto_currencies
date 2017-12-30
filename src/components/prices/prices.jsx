import React from 'react';

import { PricesControl } from 'components/prices/prices-control';
import { PricesPair } from 'components/prices/prices-pair';

import { api } from 'helpers/api/api';

class Prices extends React.Component {
  state = {
    exchanges: [
      {
        name: 'exmo',
        tickers: [],
        currencies: [],
        isActive: true
      },
      {
        name: 'bittrex',
        tickers: [],
        currencies: [],
        isActive: false
      },
      {
        name: 'kraken',
        tickers: [],
        currencies: [],
        isActive: false
      }
    ],
    tickers: []
  };

  updateCurrencies = () => {
    const exchanges = [...this.state.exchanges];
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    const currencies = [];

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

  updateTickers = (shouldLoadTickers = true) => {
    const exchanges = [...this.state.exchanges];
    const activeExchangeIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    const currencies = [...exchanges[activeExchangeIndex].currencies];
    const activeCurrencyName = currencies.map((currency) => {
      return currency.isActive ? currency.name : null;
    }).join('');

    if (shouldLoadTickers) {
      api(exchanges[activeExchangeIndex].name, 'getTickers')
        .then((json) => {
          const tickers = json;
          exchanges[activeExchangeIndex].tickers = tickers;

          if (activeCurrencyName) {
            tickers.filter((ticker) => {
              return ~ticker.name.toLowerCase().indexOf(activeCurrencyName.toLowerCase());
            });
          }

          this.setState({
            tickers: tickers
          });

          this.updateCurrencies();
        });
    } else {
      const updatedTickers = activeCurrencyName ? exchanges[activeExchangeIndex].tickers.filter((ticker) => {
        return ~ticker.name.toLowerCase().indexOf(activeCurrencyName.toLowerCase());
      }) : exchanges[activeExchangeIndex].tickers;

      this.setState({
        tickers: updatedTickers
      });

      this.updateCurrencies();
    }
  };

  onPriceControlClick = (e) => {
    const exchanges = [...this.state.exchanges];
    const controlType = e.target.dataset.type;

    if (controlType === 'exchange') {
      exchanges.forEach((exchange) => {
        return exchange.isActive = exchange.name === e.target.dataset.control;
      });
    } else if (controlType === 'currency') {
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

    if (controlType === 'exchange') {
      this.updateTickers();
    } else {
      this.updateTickers(false);
    }
  };

  componentDidMount() {
    this.updateTickers();
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

    const pricesPairs = (
      <div>
        { this.state.tickers.map((ticker) => {
          return <PricesPair pair={ ticker } key={ ticker.name }/>;
        }) }
      </div>
    );

    return (
      <div>
        { pricesExchanges }
        { pricesActiveExchange }
        { pricesActiveExchangeControls }
        { pricesPairs }
      </div>
    );
  }
}

export { Prices };