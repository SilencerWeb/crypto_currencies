import React from 'react';

function PricesControl(props) {
  return (
    <button name={ props.name }
            key={ props.name }
            onClick={ () => props.onClick(props.name) }>
      { props.name }
    </button>
  );
}

export { PricesControl };