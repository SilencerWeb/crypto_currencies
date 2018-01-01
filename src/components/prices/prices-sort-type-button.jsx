import React from 'react';

import arrowTop from 'assets/svg/arrow-top.svg';
import arrowBottom from 'assets/svg/arrow-bottom.svg';

function PricesSortTypeButton(props) {
  const icon = props.type === 'down' ?
    <img src={ arrowBottom } alt="down"/> : <img src={ arrowTop } alt="top"/>;

  return (
    <button
      className="btn btn-sm"
      data-category={ props.category }
      data-type={ props.type }
      onClick={ props.onClick }>
      { icon }
    </button>
  );
}

export { PricesSortTypeButton };