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
        isActive: true
      },
      {
        name: 'bittrex',
        tickers: [],
        isActive: false
      },
      {
        name: 'kraken',
        tickers: [],
        isActive: false
      }
    ]
  };

  updateTickers = () => {
    const exchanges = [...this.state.exchanges];
    const activeControlIndex = exchanges.findIndex((exchange) => {
      return exchange.isActive;
    });

    api(exchanges[activeControlIndex].name, 'getTickers')
      .then((tickers) => {
        exchanges[activeControlIndex].tickers = tickers;

        this.setState({
          exchanges: exchanges
        });
      });
  };

  onPriceControlClick = (control) => {
    const exchanges = [...this.state.exchanges];
    exchanges.forEach((exchange) => {
      return exchange.isActive = exchange.name === control;
    });

    this.setState({
      exchanges: exchanges
    });

    this.updateTickers();
  };

  componentDidMount() {
    this.updateTickers();
  }

  render() {
    const pricesActiveControl = this.state.exchanges.map((exchange) => {
      return exchange.isActive ? <h1 key={ exchange.name }>{ exchange.name }</h1> : null;
    });

    const pricesControls = (
      <div>
        { this.state.exchanges.map((exchange) => {
          return (
            <PricesControl
              name={ exchange.name }
              key={ exchange.name }
              onClick={ !exchange.isActive ? this.onPriceControlClick : null }/>
          );
        }) }
      </div>
    );

    const pricesPairs = (
      <div>
        { this.state.exchanges.map((exchange) => {
          return exchange.isActive ? exchange.tickers.map((pair) => {
            return <PricesPair pair={ pair } key={ pair.name }/>;
          }) : null;
        }) }
      </div>
    );

    return (
      <div>
        { pricesActiveControl }
        { pricesControls }
        { pricesPairs }
      </div>
    );
  }
}

export { Prices };