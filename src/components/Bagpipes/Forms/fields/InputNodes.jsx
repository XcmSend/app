// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { getAllConnectedNodes } from '../../utils/getAllConnectedNodes';

const InputNodes = ({ nodeId, nodes, edges, value, onChange, inputNodes }) => {
  // State that tracks the connected nodes



  // // Get all the connected nodes when nodeId, nodes, or edges change
  // useEffect(() => {
  //   if (edges) {
  //     setConnectedNodes(getAllConnectedNodes(nodeId, edges));
  //   }
  // }, [nodeId, nodes, edges]);

  // When a new connected node is added, update the form state
// When a new connected node is added, update the form state
// useEffect(() => {
//   onChange(prevState => Object.assign({}, prevState, {inputNodes: connectedNodes}));
// }, [connectedNodes, onChange]);


return (
  <div className='space-y-2'>
    <label className='block text-sm font-medium text-gray-600'>Inputs:</label>
    {inputNodes && inputNodes.map(nodeId => (
      <div
        key={nodeId}
        className='input-node p-2 border border-gray-300 rounded-md mw-1 mh-1'
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData('text/plain', `{${nodeId}}`);
        }}
      >
        {nodeId}
      </div>
    ))}
  </div>

);

};

export default InputNodes;
