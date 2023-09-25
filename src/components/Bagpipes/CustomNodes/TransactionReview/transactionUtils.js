export const prepareTransactionsForReview = (diagramData, orderedList) => {
  const extrinsicsToAccept = [];

  for (let i = 0; i < orderedList.length; i++) {
    const nodeId = orderedList[i];
    let currentNode = diagramData.nodes.find(node => node.id === nodeId);

    if (currentNode?.type === 'action' && currentNode?.formData?.actionData) {
      const actionData = currentNode.formData.actionData;

      // Grabbing symbols from the previous and next nodes using your suggestion
      const assetInNode = diagramData.nodes.find(node => node.id === orderedList[i - 1]);
      const sourceSymbol = assetInNode?.formData?.asset?.symbol;

      const assetOutNode = diagramData.nodes.find(node => node.id === orderedList[i + 1]);
      const targetSymbol = assetOutNode?.formData?.asset?.symbol;

      const extrinsicFromAction = {
        nodeId,
        actionType: actionData.actionType,
        source: {
          ...actionData.source,
          symbol: sourceSymbol // attaching the symbol
        },
        target: {
          ...actionData.target,
          symbol: targetSymbol // attaching the symbol
        }
      };

      extrinsicsToAccept.push(extrinsicFromAction);
    }
  }

  return extrinsicsToAccept;
};
