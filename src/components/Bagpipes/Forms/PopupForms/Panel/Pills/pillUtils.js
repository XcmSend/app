import { nodeTypeColorMapping } from '../nodeColorMapping';


const createPillsFromNode = (node, orderedList) => {
    const nodeIndex = orderedList.indexOf(node.id);
    const nodePill = {
      id: `node-${node.id}`,
      label: node.data.label || `Node ${nodeIndex + 1}`,
      depth: 0,
      color: nodeTypeColorMapping[node.type] || defaultColor,
      children: [],
      nodeIndex: nodeIndex + 1,
      nodeType: node.type,
    };
  
    // Dynamically process eventData and potentially other parts of the node
    const partsToProcess = ['query', 'body']; // extend as needed
    partsToProcess.forEach(part => {
      const eventDataPart = node.formData?.eventData?.[part];
      if (eventDataPart && typeof eventDataPart === 'object') {
        nodePill.children = nodePill.children.concat(
          createPillsFromObject(eventDataPart, `${part}.`, 1, node.type, nodeIndex)
        );
      }
    });
  
    return nodePill;
  };
  
  const createPillsFromObject = (obj, prefix = '', depth = 0, nodeType, nodeIndex) => {
    return Object.entries(obj).flatMap(([key, value]) => {
      const pillId = `${prefix}${key}`;
      const isNested = typeof value === 'object' && value !== null;
  
      const pill = {
        id: pillId,
        label: key,
        value: isNested ? null : value,
        color: nodeTypeColorMapping[nodeType] || defaultColor,
        depth: depth,
        children: isNested ? createPillsFromObject(value, `${pillId}.`, depth + 1, nodeType) : [],
        nodeIndex: nodeIndex + 1,
        nodeType: nodeType,
      };
  
      return pill;
    });
  };
  
  // Adjusted extraction to start from nodes instead of their eventData
  export const extractEventDataFromNodes = (nodes, allNodes, orderedList) => {
    return nodes.flatMap(nodeId => {
      const node = allNodes.find(n => n.id === nodeId);
      if (!node) {
        console.error(`Node with ID ${nodeId} not found.`);
        return [];
      }
  
      return createPillsFromNode(node, orderedList);
    });
  };