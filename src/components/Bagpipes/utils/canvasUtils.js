export const calculateTippyPosition = (node, reactFlowInstance) => {
  if (!node || !reactFlowInstance) return { x: 0, y: 0 };

  const transformedPosition = reactFlowInstance.project({
    x: node.position.x,
    y: node.position.y
  });

  // Adjust these values based on the size of the node and the tooltip
  const xOffset = 20; 
  const yOffset = 20;

  return {
    x: transformedPosition.x + xOffset,
    y: transformedPosition.y + yOffset
  };
};
