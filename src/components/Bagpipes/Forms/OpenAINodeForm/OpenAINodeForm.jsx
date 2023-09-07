// @ts-nocheck
import React, { useEffect } from 'react';
import NodeForm from '../NodeForm';

const OpenAINodeForm = ({ nodeId, nodes, edges, onNodesChange, setModalNodeId, inputNodes, formState }) => {
  console.log('OpenAINodeForm rendered for nodeId:', nodeId);

  useEffect(() => {
    console.log('OpenAINodeForm Node ID:', nodeId);
    console.log('OpenAINodeForm Form State:', formState);
  }, [nodeId, formState]);
  
  return (
    <div className="main-font">
    <NodeForm
      nodeId={nodeId}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      setModalNodeId={setModalNodeId}
      inputNodes={inputNodes}
    />
    </div>
  );
};

export default OpenAINodeForm;
