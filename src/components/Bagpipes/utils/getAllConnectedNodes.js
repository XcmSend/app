// @ts-nocheck
// utils.js


export const getAllConnectedNodes = (nodeId, edges) => {
    let connectedNodes = [];
    let nodesToCheck = [nodeId];
      

    while (nodesToCheck.length > 0) {
        let currentId = nodesToCheck.pop();
        // Find all edges from the current nodeId
        const directConnections = edges.filter(edge => edge.target === currentId);

        // Get the IDs of the nodes connected to the current nodeId
        let newIds = directConnections.map(edge => edge.source);

        // We only want to add nodes that we haven't seen yet
        newIds = newIds.filter(id => id !== nodeId && !connectedNodes.includes(id));

        // Add the found nodes to the connectedNodes array and the queue for further connections
        newIds.forEach(id => {
            if (!connectedNodes.includes(id)) {
                connectedNodes.push(id);
            }
        });
        nodesToCheck.push(...newIds);
    }

    return connectedNodes;
}

