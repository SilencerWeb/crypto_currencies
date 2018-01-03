import React from 'react';

import { PricesSortDirection } from 'components/prices/prices-sort-direction';

import { scientificToDecimal } from 'helpers/helpers';

function PricesTable(props) {
  return (
    <table className="table table-hover">
      <thead>
      <tr>
        <th>
          <span>Name</span>
        </th>
        <th>
          <span>Buy price</span>
          <PricesSortDirection category='buy' direction='up' onClick={ props.onSortTypeButtonClick }/>
          <PricesSortDirection category='buy' direction='down' onClick={ props.onSortTypeButtonClick }/>
        </th>
        <th>
          <span>Sell price</span>
          <PricesSortDirection category='sell' direction='up' onClick={ props.onSortTypeButtonClick }/>
          <PricesSortDirection category='sell' direction='down' onClick={ props.onSortTypeButtonClick }/>
        </th>
        <th>
          <span>High price</span>
          <PricesSortDirection category='high' direction='up' onClick={ props.onSortTypeButtonClick }/>
          <PricesSortDirection category='high' direction='down' onClick={ props.onSortTypeButtonClick }/>
        </th>
        <th>
          <span>Low price</span>
          <PricesSortDirection category='low' direction='up' onClick={ props.onSortTypeButtonClick }/>
          <PricesSortDirection category='low' direction='down' onClick={ props.onSortTypeButtonClick }/>
        </th>
        <th>
          <span>Volume</span>
          <PricesSortDirection category='vol' direction='up' onClick={ props.onSortTypeButtonClick }/>
          <PricesSortDirection category='vol' direction='down' onClick={ props.onSortTypeButtonClick }/>
        </th>
      </tr>
      </thead>
      <tbody>
      { props.tickers.map((ticker) => {
        return (
          <tr key={ ticker.name }>
            <th>{ ticker.name }</th>
            <td>{ scientificToDecimal(ticker.buy) }</td>
            <td>{ scientificToDecimal(ticker.sell) }</td>
            <td>{ scientificToDecimal(ticker.high) }</td>
            <td>{ scientificToDecimal(ticker.low) }</td>
            <td>{ scientificToDecimal(ticker.vol) }</td>
          </tr>
        );
      }) }
      </tbody>
    </table>
  );
}

export { PricesTable };