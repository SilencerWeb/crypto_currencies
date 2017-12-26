import React from 'react';
import styled from 'styled-components';

function PricesPair(props) {
  return (
    <div className={ props.className }>
      <h2>{ props.pair.name }</h2>
      <div>High: { props.pair.high }</div>
      <div>Avg: { props.pair.avg }</div>
      <div>Low: { props.pair.low }</div>
    </div>
  );
}

const styledPricesPairs = styled(PricesPair)`
  border: 1px solid #eeeeee;
  border-radius: 2px;
  padding: 5px;
  margin: 10px;
`;

export { styledPricesPairs as PricesPair };