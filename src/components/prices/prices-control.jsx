import React from 'react';

function PricesControl(props) {
  return (
    <button
      name={ props.name }
      onClick={ props.onClick ? () => props.onClick(props.name) : null }>
      { props.name }
    </button>
  );
}

export { PricesControl };