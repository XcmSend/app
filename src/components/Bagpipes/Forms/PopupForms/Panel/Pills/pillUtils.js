import { nodeTypeColorMapping } from '../nodeColorMapping';

export const extractEventDataFromNodes = (nodes, allNodes, orderedList, executions) => {
  // Clear the pills array first
  let pills = [];

  nodes.forEach(nodeId => {
    const node = allNodes.find(n => n.id === nodeId);
    if (!node) {
      console.error(`Node with ID ${nodeId} not found.`);
      return;
    }
    console.log("extractEventDataFromNodes - node:", node);
    
    // Get the execution data for the current node
    const executionData = executions ? executions[nodeId] : {};
    console.log("extractEventDataFromNodes - executionData:", executionData);
    const eventUpdates = executionData?.responseData?.eventUpdates || [];
    
    // Update node with execution response data
    const nodeWithResponseData = {
      ...node,
      responseData: eventUpdates.reduce((acc, update) => {
        return { ...acc, ...update.data };
      }, {}),
    };

    pills = pills.concat(createPillsFromNode(nodeWithResponseData, orderedList));
  });

  return pills;
};

const createPillsFromNode = (node, orderedList) => {
  const nodeIndex = orderedList.indexOf(node.id);
  const nodePill = {
    id: `node-${node.id}`,
    label: node.data.label || `Node ${nodeIndex + 1}`,
    depth: 0,
    color: nodeTypeColorMapping[node.type] || nodeTypeColorMapping.defaultColor,
    children: [],
    nodeIndex: nodeIndex + 1,
    nodeType: node.type,
  };

  switch (node.type) {
    // case 'webhook':
    //   console.log("createPillsFromNode - node:", node);
    //   // Process Webhook nodes by extracting 'query' and 'content'
    //   const partsToProcess = ['query', 'content'];
    //   partsToProcess.forEach(part => {
    //     const eventDataPart = node.responseData?.[part];
    //     if (eventDataPart && typeof eventDataPart === 'object') {
    //       nodePill.children = nodePill.children.concat(
    //         createPillsFromObject(eventDataPart, `${part}.`, 1, node.type, nodeIndex)
    //       );
    //     }
    //   });
    //   break;
    case 'webhook': 
    case 'http':
    case 'chainTx':
    case 'chainQuery':
      // For these node types, process the entire responseData as a pill
      if (node.responseData && typeof node.responseData === 'object') {
        nodePill.children = createPillsFromObject(node.responseData, '', 1, node.type, nodeIndex);
      }
      break;

    // Handle other node types as necessary
    default:
      if (node.responseData && typeof node.responseData === 'object') {
        nodePill.children = createPillsFromObject(node.responseData, '', 1, node.type, nodeIndex);
      }
      break;
  }

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
      color: nodeTypeColorMapping[nodeType] || nodeTypeColorMapping.defaultColor,
      depth: depth,
      children: isNested ? createPillsFromObject(value, `${pillId}.`, depth + 1, nodeType, nodeIndex) : [],
      nodeIndex: nodeIndex + 1,
      nodeType: nodeType,
    };

    return pill;
  });
};
