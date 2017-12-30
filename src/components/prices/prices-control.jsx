import React from 'react';

function PricesControl(props) {
  return (
    <button
      data-control={ props.name }
      data-type={ props.type }
      onClick={ props.onClick }>
      { props.name }
    </button>
  );
}

export { PricesControl };