import React from 'react';

function Button(props) {
  const attributes = {};

  Object.keys(props).forEach((key) => {
    if (key !== 'onClick') attributes[key] = props[key];
  });

  return (
    <button { ...attributes } onClick={ props.onClick }>
      { props.children }
    </button>
  );
}

export { Button };