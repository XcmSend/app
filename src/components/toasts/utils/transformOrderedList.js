const transformOrderedList = (orderedList, nodes) => {
    return orderedList.map(id => {
        const node = nodes.find(node => node.id === id);
        if (!node) {
            console.error(`Node with id ${id} not found.`);
            return null;
        }

        if (node.type === 'chain') {
            return {
                type: 'chain',
                name: node.formData?.chain || ""
            };
        } else if (node.type === 'action') {
            return {
                type: 'action',
                action: node.formData?.action || "" 
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