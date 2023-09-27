// @ts-nocheck

import { toast } from "react-hot-toast";


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
    console.log('[getOrderedList] Received edges:', edges);

    // Handle no edges case
    if (!edges || edges.length === 0) {
        console.log('[getOrderedList] No edges received.');
        return [];
    }

    // Handle single edge case
    if (edges.length === 1) {
        console.log('[getOrderedList] Only one edge received:', edges[0]);
        return [edges[0].source, edges[0].target];
    }

    // Below is your original logic
    let orderedList = [];
    
    // Find the Start Node
    let startEdge = edges.find(edge => 
        !edges.some(e => e.target === edge.source)
    );
    if (!startEdge) {
        console.error('[getOrderedList] Failed at finding the start node.');
        throw new Error('Start node not found.');
    }
    console.log('[getOrderedList] Start node found:', startEdge);  // Log the start node

    // Find the End Node
    let endEdge = edges.find(edge => 
        !edges.some(e => e.source === edge.target)
    );
    if (!endEdge) {
        console.error('[getOrderedList] Failed at finding the end node.');
        throw new Error('End node not found.');
    }
    console.log('[getOrderedList] End node found:', endEdge);  // Log the end node

    let currentEdge = startEdge;
    orderedList.push(currentEdge.source);

    // Loop through edges to build the ordered list
    while (currentEdge && currentEdge !== endEdge) {
        currentEdge = edges.find(edge => edge.source === currentEdge.target);
        if (currentEdge) {
            // console.log('[getOrderedList] Current edge being processed:', currentEdge);
            orderedList.push(currentEdge.source);
        }
    }
    
    // Add the target of the endEdge (the last node) to the ordered list.
    orderedList.push(endEdge.target);
    
    console.log('[getOrderedList] Final ordered list:', orderedList);
    return orderedList;
}




export function validateDiagramData(diagramData) {
    console.log('Inside validateDiagramData');
    console.log('Nodes:', diagramData.nodes);
    console.log('Edges:', diagramData.edges);

    // Check if there are multiple starting nodes
    const startingNodes = diagramData.nodes.filter(
        node => !diagramData.edges.find(edge => edge.target === node.id)
    );

    if (startingNodes.length > 1) {
        throw new Error("There are multiple starting nodes. Please make sure there's only one starting point in the diagram.");
    }

    // Check for multiple ending nodes
    const endingNodes = diagramData.nodes.filter(
        node => !diagramData.edges.find(edge => edge.source === node.id)
    );

    if (endingNodes.length > 1) {
        throw new Error("There are multiple ending nodes. Please make sure there's only one ending point in the diagram.");
    }

    // TODO: check for circular references (This will need a more advanced algorithm)
    
    // TODO: check for multiple paths (Another advanced algorithm)

    // Ensure action nodes are not at the start or end
    if (startingNodes[0]?.type === 'action' || endingNodes[0]?.type === 'action') {
        toast.error("Scenarios cannot start or end with an action node.");
    }

    // Ensure that chain nodes or action nodes are not connected directly 
    diagramData.edges.forEach(edge => {
        const sourceType = diagramData.nodes.find(node => node.id === edge.source)?.type;
        const targetType = diagramData.nodes.find(node => node.id === edge.target)?.type;

        if ((sourceType === 'chain' && targetType === 'chain') || 
            (sourceType === 'action' && targetType === 'action')) {
            toast.error("Chain nodes or action nodes are connected to each other directly. They should be connected as ChainNode > ActionNode > ChainNode.");
            throw new Error("Chain nodes or action nodes are connected to each other directly. They should be connected as ChainNode > ActionNode > ChainNode.");
        }
    });

    // Additional validation checks can go here

    // Return diagramData if no issues found
    return diagramData;
}

export function processScenarioData(diagramData) {
    // Validate the data
    if (!Array.isArray(diagramData.nodes) || !Array.isArray(diagramData.edges)) {
        throw new Error('Invalid diagramData format');
    }

    let sortedNodes = [];
    let edges = [...diagramData.edges];
    let nodes = [...diagramData.nodes];

    // Assuming your flow always starts from a single node
    let currentNode = nodes.find(node => !edges.find(edge => edge.target === node.id));

    while (currentNode) {
        sortedNodes.push(currentNode);
        let outgoingEdge = edges.find(edge => edge.source === currentNode.id);
        
        // If there is no outgoingEdge, then currentNode is the last node in the flow.
        if (!outgoingEdge) {
            break;
        }

        currentNode = nodes.find(node => node.id === outgoingEdge.target);
    }

    // Return both sorted nodes and edges
    return { nodes: sortedNodes, edges };
}
