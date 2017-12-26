import React from 'react';

import { PricesControl } from 'components/prices/prices-control';
import { PricesPair } from 'components/prices/prices-pair';

class Prices extends React.Component {
  state = {
    exchanges: [
      {
        name: 'exmo',
        pairs: [
          {
            name: 'BTC/USD',
            high: 602.082,
            low: 584.51011695,
            avg: 591.14698808
          },
          {
            name: 'XRP/USD',
            high: 1.34,
            low: 0.64,
            avg: 1
          }
        ],
        isActive: true
      },
      {
        name: 'kraken',
        pairs: [
          {
            name: 'BTC/USD',
            high: 642.082,
            low: 544.51011695,
            avg: 541.14698808
          },
          {
            name: 'XRP/USD',
            high: 2.34,
            low: 1.64,
            avg: 2
          }
        ],
        isActive: false
      }
    ]
  };

  onPriceControlClick = (control) => {
    const exchanges = [...this.state.exchanges];
    exchanges.forEach((exchange) => {
      return exchange.isActive = exchange.name === control;
    });

    this.setState({
      exchanges: exchanges
    });
  };

  render() {
    const pricesActiveControl = this.state.exchanges.map((exchange) => {
      return exchange.isActive ? <h1>{ exchange.name }</h1> : null;
    });

    const pricesControls = (
      <div>
        { this.state.exchanges.map((exchange) => {
          return <PricesControl name={ exchange.name } onClick={ this.onPriceControlClick }/>;
        }) }
      </div>
    );

    const pricesPairs = (
      <div>
        { this.state.exchanges.map((exchange) => {
          return exchange.isActive ? exchange.pairs.map((pair) => {
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