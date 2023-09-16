export function replacePlaceholders(text, nodeContents, validNodeIds=[]) {
    let newText = text;

    for (let nodeId in nodeContents) {
        const placeholder = `{${nodeId}}`;
        if (newText.includes(placeholder)) {
            newText = newText.replace(new RegExp(placeholder, 'g'), nodeContents[nodeId]);
        }
    }

    // Enhanced Error Handling
    const remainingPlaceholders = newText.match(/{([^{}]+)}/g);
    if (remainingPlaceholders) {
        const invalidPlaceholders = remainingPlaceholders.filter(placeholder => validNodeIds.includes(placeholder.slice(1, -1)));

        if (invalidPlaceholders.length > 0) {
            throw new Error(`Unable to replace placeholders: ${invalidPlaceholders.join(', ')}`);
        }
    }

    return newText;
}

export function getOrderedList(edges) {
    let orderedList = [];

    // Find the starting edge (source node starts with "input_")
    let currentEdge = edges.find(edge => edge.source.startsWith('input_'));
    
    if(!currentEdge) {
        console.error('Starting edge not found');
        return null;
    }
    
    orderedList.push(currentEdge.source); // Add the starting node to the list

    // Loop until we find an edge that ends with an "output_" node
    while (!currentEdge.target.startsWith('output_')) {
        // Find the next edge, where the source is the target of the current edge
        currentEdge = edges.find(edge => edge.source === currentEdge.target);
        if(!currentEdge) {
            return console.error('Next edge not found');

        }
        orderedList.push(currentEdge.source); // Add the node to the list
    }

    // Add the final output node to the list
    orderedList.push(currentEdge.target);

    return orderedList;
}
