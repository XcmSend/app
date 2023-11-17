export const prepareTransactionsForReview = (diagramData, orderedList) => {
  const extrinsicsToAccept = [];

  for (let i = 0; i < orderedList.length; i++) {
    const nodeId = orderedList[i];
    let currentNode = diagramData.nodes.find(node => node.id === nodeId);
    console.log(`formdata: `, diagramData);
    const delay = diagramData.nodes[0].formData.delay;
    if (currentNode?.type === 'action' && currentNode?.formData?.actionData) {
      const actionData = currentNode.formData.actionData;
      console.log(`currentNode.formData: `, currentNode.formData);
      console.log(`actionData:`, actionData);
      console.log(`delay is:`, delay);
      // Grabbing symbols from the previous and next nodes using your suggestion
      const assetInNode = diagramData.nodes.find(node => node.id === orderedList[i - 1]);
      const sourceSymbol = assetInNode?.formData?.asset?.symbol;
      var sourcedatan;
      sourcedatan = actionData.source;
      sourcedatan['delay'] = delay;
      const assetOutNode = diagramData.nodes.find(node => node.id === orderedList[i + 1]);
      const targetSymbol = assetOutNode?.formData?.asset?.symbol;

      const extrinsicFromAction = {
        nodeId,
        actionType: actionData.actionType,
        source: {
          ...sourcedatan,
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
