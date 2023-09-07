// @ts-nocheck
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

    // Additional validation checks can go here

    // Return diagramData
    return diagramData;
}
