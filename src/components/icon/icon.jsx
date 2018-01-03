import React from 'react';
import styled, { css } from 'styled-components';

function Icon(props) {
  return (
    <svg className={ props.className }>
      <use xlinkHref={ '#' + props.icon.id }/>
    </svg>
  );
}

const styledIcon = styled(Icon)`
  display: inline-block;
  vertical-align: top;
  
  ${props => props.icon && css`
    width: ${props.icon.node.viewBox.animVal.width / props.icon.node.viewBox.animVal.height}em;
    height: 1em;
    font-size: ${props.height || props.icon.node.viewBox.animVal.height}px;
  `};
  
  fill: currentColor;
`;

export { styledIcon as Icon };