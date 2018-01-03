import React from 'react';

import { TickersSortDirection } from 'components/tickers/tickers-sort-direction';

import { scientificToDecimal } from 'helpers/helpers';

function TickersTable(props) {
  return (
    <table className="table table-hover">
      <thead>
      <tr>
        <th>
          <span>Name</span>
        </th>
        <th>
          <span>Buy price</span>
          <TickersSortDirection category='buy' direction='up' onClick={ props.onSortDirectionClick }/>
          <TickersSortDirection category='buy' direction='down' onClick={ props.onSortDirectionClick }/>
        </th>
        <th>
          <span>Sell price</span>
          <TickersSortDirection category='sell' direction='up' onClick={ props.onSortDirectionClick }/>
          <TickersSortDirection category='sell' direction='down' onClick={ props.onSortDirectionClick }/>
        </th>
        <th>
          <span>High price</span>
          <TickersSortDirection category='high' direction='up' onClick={ props.onSortDirectionClick }/>
          <TickersSortDirection category='high' direction='down' onClick={ props.onSortDirectionClick }/>
        </th>
        <th>
          <span>Low price</span>
          <TickersSortDirection category='low' direction='up' onClick={ props.onSortDirectionClick }/>
          <TickersSortDirection category='low' direction='down' onClick={ props.onSortDirectionClick }/>
        </th>
        <th>
          <span>Volume</span>
          <TickersSortDirection category='vol' direction='up' onClick={ props.onSortDirectionClick }/>
          <TickersSortDirection category='vol' direction='down' onClick={ props.onSortDirectionClick }/>
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

export { TickersTable };