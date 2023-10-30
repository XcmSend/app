
// Link.jsx

import React from 'react';

const Link = (props) => {
  const { entityKey, contentState } = props;
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a
      className={`link ${props.connections[url] ? 'link--active' : 'link--inactive'}`}
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {props.children}
    </a>
  );
};

export default Link;
