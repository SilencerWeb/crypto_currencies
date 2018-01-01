import React from 'react';
import styled from 'styled-components';

function PricesControl(props) {
  const classes = ['btn', 'btn-primary', props.className].join(' ');

  return (
    <button
      className={ classes }
      data-control={ props.name }
      data-type={ props.type }
      onClick={ props.onClick }>
      { props.name }
    </button>
  );
}

const styledPriceControl = styled(PricesControl)`
  margin: 2.5px 5px;
`;

export { styledPriceControl as PricesControl };