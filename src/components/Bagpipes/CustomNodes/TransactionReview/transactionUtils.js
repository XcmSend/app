export const prepareTransactionsForReview = (diagramData, orderedList) => {
  const extrinsicsToAccept = [];

  for (let i = 0; i < orderedList.length; i++) {
    const nodeId = orderedList[i];
    let currentNode = diagramData.nodes.find(node => node.id === nodeId);
    const delay = diagramData.nodes[0].formData.delay;

    if (currentNode?.type === 'action' && currentNode?.formData?.actionData) {
      const actionData = currentNode.formData.actionData;

      // Grabbing symbols from the previous and next nodes
      const assetInNode = diagramData.nodes.find(node => node.id === orderedList[i - 1]);
      const sourceSymbol = assetInNode?.formData?.asset?.symbol;

      const assetOutNode = diagramData.nodes.find(node => node.id === orderedList[i + 1]);
      const targetSymbol = assetOutNode?.formData?.asset?.symbol;

      const sourcedatan = {
        ...actionData.source,
        delay,
        symbol: sourceSymbol // attaching the symbol
      };

      const extrinsicFromAction = {
        nodeId,
        actionType: actionData.actionType,
        source: sourcedatan,
        target: {
          ...actionData.target,
          symbol: targetSymbol // attaching the symbol
        }
      };

      extrinsicsToAccept.push(extrinsicFromAction);
    } else if (currentNode?.type === 'chainTx' && currentNode?.formData) {
      const chainTxData = currentNode.formData;

      // Grabbing symbols from the previous and next nodes
      const assetInNode = diagramData.nodes.find(node => node.id === orderedList[i - 1]);
      const sourceSymbol = assetInNode?.formData?.asset?.symbol;

      const assetOutNode = diagramData.nodes.find(node => node.id === orderedList[i + 1]);
      const targetSymbol = assetOutNode?.formData?.asset?.symbol;

      const extrinsicFromChainTx = {
        nodeId,
        actionType: 'chainTx',
        source: {
          ...chainTxData,
          symbol: sourceSymbol, // attaching the symbol
          delay
        },
        target: {
          symbol: targetSymbol // attaching the symbol
        }
      };

      extrinsicsToAccept.push(extrinsicFromChainTx);
    }
  }

  return extrinsicsToAccept;
};

