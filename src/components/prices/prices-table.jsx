import React from 'react';

import { PricesSortTypeButton } from 'components/prices/prices-sort-type-button';

function PricesTable(props) {
  return (
    <table className="table table-hover">
      <thead>
      <tr>
        <th>
          <span>Name</span>
          <PricesSortTypeButton category='name' type='up' onClick={ props.onClick }/>
          <PricesSortTypeButton category='name' type='down' onClick={ props.onClick }/>
        </th>
        <th>
          <span>Buy price</span>
          <PricesSortTypeButton category='buy' type='up' onClick={ props.onClick }/>
          <PricesSortTypeButton category='buy' type='down' onClick={ props.onClick }/>
        </th>
        <th>
          <span>Sell price</span>
          <PricesSortTypeButton category='sell' type='up' onClick={ props.onClick }/>
          <PricesSortTypeButton category='sell' type='down' onClick={ props.onClick }/>
        </th>
        <th>
          <span>High price</span>
          <PricesSortTypeButton category='high' type='up' onClick={ props.onClick }/>
          <PricesSortTypeButton category='high' type='down' onClick={ props.onClick }/>
        </th>
        <th>
          <span>Low price</span>
          <PricesSortTypeButton category='low' type='up' onClick={ props.onClick }/>
          <PricesSortTypeButton category='low' type='down' onClick={ props.onClick }/>
        </th>
        <th>
          <span>Volume</span>
          <PricesSortTypeButton category='vol' type='up' onClick={ props.onClick }/>
          <PricesSortTypeButton category='vol' type='down' onClick={ props.onClick }/>
        </th>
      </tr>
      </thead>
      <tbody>
      { props.tickers.map((ticker) => {
        return (
          <tr key={ ticker.name }>
            <th>{ ticker.name }</th>
            <td>{ ticker.buy }</td>
            <td>{ ticker.sell }</td>
            <td>{ ticker.high }</td>
            <td>{ ticker.low }</td>
            <td>{ ticker.vol }</td>
          </tr>
        );
      }) }
      </tbody>
    </table>
  );
}

export { PricesTable };