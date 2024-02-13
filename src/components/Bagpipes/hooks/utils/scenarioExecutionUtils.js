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

export const findUpstreamNodes = (orderedList, nodeId) => {
    const currentNodeIndex = orderedList.findIndex(nodeIdInList => nodeIdInList === nodeId);

    if (currentNodeIndex === -1) {
      console.error("Current node not found in the ordered list.");
      return [];
    }
  
    // All nodes before the current node are considered upstream
    return orderedList.slice(0, currentNodeIndex);
  };

//   export const extractEventDataFromNodes = (nodes) => {
//     return nodes.flatMap(node => {
//       // Focus on the 'query' object inside 'eventData'
//       const queryData = node.formData?.eventData?.query || {};
//       return Object.entries(queryData).map(([key, value]) => ({
//         // Define the structure of your pills here
//         id: `${node.id}_${key}`, // Unique ID combining node ID and key
//         label: key, // The key is used as the label of the pill
//         value: value, // The value of the query parameter
//         // other properties as needed
//       }));
//     });
//   };
  
  

// export function getOrderedList(edges) {
//     let orderedList = [];

//     // Find the starting edge (source node starts with "input_")
//     let currentEdge = edges.find(edge => edge.source.startsWith('input_'));
    
//     if(!currentEdge) {
//         console.error('Starting edge not found');
//         return null;
//     }
    
//     orderedList.push(currentEdge.source); // Add the starting node to the list

//     // Loop until we find an edge that ends with an "output_" node
//     while (!currentEdge.target.startsWith('output_')) {
//         // Find the next edge, where the source is the target of the current edge
//         currentEdge = edges.find(edge => edge.source === currentEdge.target);
//         if(!currentEdge) {
//             return console.error('Next edge not found');

//         }
//         orderedList.push(currentEdge.source); // Add the node to the list
//     }

//     // Add the final output node to the list
//     orderedList.push(currentEdge.target);

//     return orderedList;
// }


export function getOrderedList(edges) {
    // console.log('[getOrderedList] Received edges:', edges);

    // Handle no edges case
    if (!edges || edges.length === 0) {
        // console.log('[getOrderedList] No edges received.');
        return [];
    }

    // Handle single edge case
    if (edges.length === 1) {
        // console.log('[getOrderedList] Only one edge received:', edges[0]);
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
    // console.log('[getOrderedList] Start node found:', startEdge);  // Log the start node

    // Find the End Node
    let endEdge = edges.find(edge => 
        !edges.some(e => e.source === edge.target)
    );
    if (!endEdge) {
        console.error('[getOrderedList] Failed at finding the end node.');
        throw new Error('End node not found.');
    }
    // console.log('[getOrderedList] End node found:', endEdge);  // Log the end node

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
    
    // console.log('[getOrderedList] Final ordered list:', orderedList);
    return orderedList;
}




export async function smoothZoom(instance, targetZoomLevel, duration = 500) {
    return new Promise((resolve) => {
        const startZoomLevel = instance.getZoom();
        console.log('[smoothZoom] Starting zoom:', startZoomLevel);
        const zoomChange = targetZoomLevel - startZoomLevel;
        console.log('[smoothZoom] Zoom change:', zoomChange);
        const startTime = performance.now();

        const animateZoom = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);  // Ensure the progress doesn't exceed 1
            const currentZoom = startZoomLevel + zoomChange * progress;

            instance.zoomTo(currentZoom);

            if (progress < 1) {
                requestAnimationFrame(animateZoom);
            } else {
                resolve();
            }
        };

        requestAnimationFrame(animateZoom);
    });
};