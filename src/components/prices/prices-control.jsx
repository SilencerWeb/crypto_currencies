import React from 'react';

function PricesControl(props) {
  return (
    <button
      data-control={ props.name }
      name={ props.name }
      onClick={ props.onClick }>
      { props.name }
    </button>
  );
}

export { PricesControl };