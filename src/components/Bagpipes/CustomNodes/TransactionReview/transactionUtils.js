export const prepareTransactionsForReview = (diagramData, orderedList) => {
  const extrinsicsToAccept = [];

  for (let nodeId of orderedList) {
    let currentNode = diagramData.nodes.find(node => node.id === nodeId);
    if (currentNode?.type === 'action' && currentNode?.data?.formState?.actionData) {
      const extrinsicFromAction = {
        nodeId, 
        actionType: currentNode.data.formState.actionData.actionType,
        source: currentNode.data.formState.actionData.source,
        target: currentNode.data.formState.actionData.target,
      };
      extrinsicsToAccept.push(extrinsicFromAction);
    }
  }

  return extrinsicsToAccept;
};