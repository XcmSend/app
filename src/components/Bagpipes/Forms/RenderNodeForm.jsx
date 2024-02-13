import React from 'react';
import { OpenAINodeForm, ChainNodeForm } from './index';

const RenderNodeForm = ({ nodeId, nodes, edges, setNodes, setEdges, onNodesChange, setModalNodeId }) => {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;
  const isVisible = Boolean(nodeId); // Determines if the form should be visible

  const commonProps = { nodeId, nodes, edges, onNodesChange, setModalNodeId, visible: isVisible };



  switch (node.type) {
    case 'openAi':
      return <OpenAINodeForm {...commonProps} />;
    case 'chain':
      return <ChainNodeForm {...commonProps} />;
    // Add cases for other node types
    default:
      return null; // or a generic form if applicable
  }
};

export default RenderNodeForm;
