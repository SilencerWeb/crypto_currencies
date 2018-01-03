import React from 'react';
import styled from 'styled-components';

import { Icon } from 'components/icon/icon';

import arrowTop from 'assets/svg/arrow-top.svg';
import arrowBottom from 'assets/svg/arrow-bottom.svg';

function PricesSortDirection(props) {
  let icon = null;

  if (props.direction === 'down') {
    icon = arrowTop;
  } else if (props.direction === 'up') {
    icon = arrowBottom;
  }

  return (
    <button
      className={ props.className }
      onClick={ () => props.onClick(props.category, props.direction) }>
      <Icon height="14" icon={ icon }/>
    </button>
  );
}

const styledPricesSortDirection = styled(PricesSortDirection)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 2.5px;
  margin: 0 2.5px;
  cursor: pointer;
  
  &:focus {
    outline: none;
  }
`;

export { styledPricesSortDirection as PricesSortDirection };