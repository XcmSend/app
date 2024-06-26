const transformOrderedList = (orderedList, nodes) => {
    return orderedList.map(id => {
        const node = nodes.find(node => node.id === id);
        if (!node) {
            console.error(`Node with id ${id} not found.`);
            return null;
        }

        if (node.type === 'chain') {
            console.log('transformOrderedList - chain node:', node.formData?.chain);
            return {
                type: 'chain',
                name: node.formData?.chain || ""
            };
        } else if (node.type === 'action') {
            console.log('transformOrderedList - action node:', node.formData?.action);

            return {
                type: 'action',
                action: node.formData?.action || "" 
            };
        } else if (node.type === 'chainQuery') {
            console.log('transformOrderedList - chainQuery node:', node.formData?.selectedChain);

            return {
                type: 'chainQuery',
                name: node.formData?.selectedChain || "" 
            };
        } else if (node.type === 'chainTx') {
            console.log('transformOrderedList - chainTx node:', node.formData?.selectedChain);

            return {
                type: 'chainTx',
                name: node.formData?.selectedChain || "" 
            };

        } else if (node.type === 'webhook') {

            return {
                type: 'webhook',
                name:  "" 
            };
        } else if (node.type === 'http') {

                return {
                    type: 'http',
                    name:  "" 
                };
            }
    
        
        return null;
    }).filter(Boolean); // Removes null entries
};

export default transformOrderedList;

// README:

// Now, you can transform the orderedList and pass it to the OrderedListContent component:

// const transformedList = transformOrderedList(orderedList, scenarios[activeScenarioId]?.diagramData?.nodes);

// <OrderedListContent list={transformedList} />