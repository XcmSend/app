// @ts-nocheck
import React from 'react';

const OpenAINodeFields = ({ data }) => {
  return (
    <div className="openai-node__fields text-xs">
      <p>Model: {data.model ? data.model.name : 'Loading...'}</p>
      <p>Categories:</p>
      <ul>
        {data.hashtags ? data.hashtags.map((hashtag) => (
          <li key={hashtag}>{hashtag}</li>
        )) : 'Loading...'}
      </ul>
    </div>
  );
};

export default OpenAINodeFields;
