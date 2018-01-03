import React from 'react';
import styled from 'styled-components';

function PricesControl(props) {
  return (
    <button
      className={ `btn btn-primary ${props.className}` }
      onClick={ props.onClick ? () => props.onClick(props.name, props.type) : null }>
      { props.name }
    </button>
  );
}

const styledPriceControl = styled(PricesControl)`
  margin: 2.5px 5px;
`;

export { styledPriceControl as PricesControl };