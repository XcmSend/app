
import WebhooksService from '../../../../services/WebhooksService';
import useAppStore  from '../../../../store/useAppStore';


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
    console.log('Current node index:', nodeId, currentNodeIndex);
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



/**
 * Fetches the execution data for a given node within the active scenario.
 * 
 * @param {Object} scenarios - The scenarios object containing all scenario data.
 * @param {string} activeScenarioId - The ID of the currently active scenario.
 * @param {string} nodeId - The ID of the node for which to fetch execution data.
 * @returns {Object|null} The execution data for the given node, or null if not found.
 */
export function fetchNodeExecutionData(scenarios, activeScenarioId, nodeId) {
    // Ensure the active scenario exists
    const activeScenario = scenarios[activeScenarioId];
    if (!activeScenario || !activeScenario.executions) {
        console.error(`Active scenario with ID ${activeScenarioId} not found or does not contain executions.`);
        return null;
    }

    // Loop through each execution within the active scenario to find the node's execution data
    for (const executionId of Object.keys(activeScenario.executions)) {
        const execution = activeScenario.executions[executionId];
        if (execution && execution[nodeId]) {
            return execution[nodeId]; // Return the execution data for the node
        }
    }

    // If the function reaches this point, no execution data was found for the node
    console.error(`Execution data for node with ID ${nodeId} not found in active scenario.`);
    return null;
}


// export const processWebhookEvent = (webhookEventData, webhookFetchStartTime) => {
//     const fetchStartTimeUTC = webhookFetchStartTime.getTime() + (webhookFetchStartTime.getTimezoneOffset() * 60000);
//     console.log('Comparing against fetch start time:', fetchStartTimeUTC);
//     console.log('processWebhookEvent webhookEventData:', webhookEventData);
//     const newWebhookEvent = webhookEventData?.find(event => {
//         console.log('Event created at:', event.created_at);
//         const eventCreatedAtUTC = new Date(event.created_at).getTime();
//         console.log('Event created at:', eventCreatedAtUTC);
//         return eventCreatedAtUTC > fetchStartTimeUTC;
//     });

//     console.log('processWebhookEvent New event found:', newWebhookEvent);

//     // If a new event is found, process it
//     if (newWebhookEvent) {
//         const processedEventData = {
//             query: newWebhookEvent.query || null,
//             content: parseWebhookContent(newWebhookEvent.content || null),
//             headers: newWebhookEvent.headers || null,
//             method: newWebhookEvent.method || null,
//             createdAt: newWebhookEvent.created_at || null,
//         };
//         return { processedEventData, isNewEvent: true };
//     }
//     console.log('processWebhookEvent No new event found', webhookEventData.data[0])
//     // If no new event is found, return the most recent event but indicate it's not new
//     // const mostRecentEvent = webhookEventData.data[0]; // Assuming data is sorted by created_at
//     // console.log('processWebhookEvent Most recent event:', mostRecentEvent);
//     // const processedMostRecentEventData = {
//     //     query: mostRecentEvent.query || null,
//     //     content: parseWebhookContent(mostRecentEvent.content || null),
//     //     headers: mostRecentEvent.headers || null,
//     //     method: mostRecentEvent.method || null,
//     //     createdAt: mostRecentEvent.created_at || null,
//     // };

//     // return { processedEventData: processedMostRecentEventData, isNewEvent: false };
//         return { processedEventData: null, isNewEvent: false };

// };

export const processWebhookEvent = (webhookEventData, webhookFetchStartTime) => {
    const fetchStartTimeUTC = webhookFetchStartTime.getTime() + (webhookFetchStartTime.getTimezoneOffset() * 60000);
    console.log('Comparing against fetch start time:', fetchStartTimeUTC);
    console.log('processWebhookEvent webhookEventData:', webhookEventData);

    try {
        const eventCreatedAtUTC = webhookEventData.created_at ? new Date(webhookEventData.created_at).getTime() : null;
        
        if (eventCreatedAtUTC && isNaN(eventCreatedAtUTC)) {
            throw new Error('Invalid created_at date');
        }

        if (eventCreatedAtUTC && eventCreatedAtUTC > fetchStartTimeUTC) {
            const processedEventData = {};
            for (const key in webhookEventData) {
                if (webhookEventData.hasOwnProperty(key)) {
                    processedEventData[key] = webhookEventData[key];
                }
            }

            if (processedEventData.content) {
                processedEventData.content = parseWebhookContent(processedEventData.content);
            }
            console.log('processWebhookEvent New event found:', processedEventData);
            return { processedEventData, isNewEvent: true };
        } else {
            return { processedEventData: null, isNewEvent: false };
        }
    } catch (error) {
        console.error('Error processing webhook event:', error);
        return { processedEventData: null, isNewEvent: false };
    }
};


export const waitForNewWebhookEvent = async (uuid, webhookFetchStartTime, nodeId) => {
    let foundNewEvent = false;
    let processedEventData = null;

    while (!foundNewEvent && useAppStore.getState().isExecuting && useAppStore.getState().nodeLoadingStates[nodeId]) {
        try {
            const webhookData = await WebhooksService.fetchLatestFromWebhookSite(uuid);
            const { processedEventData: newEventData, isNewEvent } = processWebhookEvent(webhookData, webhookFetchStartTime);

            if (isNewEvent) {
                foundNewEvent = true;
                processedEventData = newEventData;
                break; // Exit the loop if a new event is found
            }
        } catch (error) {
            console.error('Error fetching new webhook event:', error);
        }

        // Wait for a specified interval before polling again
        await new Promise(resolve => setTimeout(resolve, 2000)); 
    }

    return processedEventData;
};



// export const waitForNewWebhookEvent = async (uuid, webhookFetchStartTime, nodeId) => {
//     let foundNewEvent = false;
//     let processedEventData = null;

//     while (!foundNewEvent && useAppStore.getState().isExecuting && useAppStore.getState().nodeLoadingStates[nodeId]) {
//         const webhookData = await WebhooksService.fetchLatestFromWebhookSite(uuid);
//         const { processedEventData: newEventData, isNewEvent } = processWebhookEvent(webhookData, webhookFetchStartTime);

//         if (isNewEvent) {
//             foundNewEvent = true;
//             processedEventData = newEventData;
//             break; // Exit the loop if a new event is found
//         }

//         // Wait for a specified interval before polling again
//         await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 5 seconds before the next poll

//         // // Here, add a check to see if execution has been stopped
//         // if (!useAppStore.getState().isExecuting || !useAppStore.getState().nodeLoadingStates[nodeId]) {
//         //     useAppStore.getState().setIsLoadingNode(nodeId, false);
//         //     console.log("Execution stopped, exiting the waiting loop.");
//         //     return null; // Exit the function as the execution has been stopped
//         // }
//     }

//     return processedEventData;
// };



const parseWebhookContent = (content) => {
    try {
        return JSON.parse(content);
    } catch (error) {
        console.error('Error parsing webhook content:', error);
        return {}; 
    }
};


// export async function waitForNewWebhookEvent(uuid, startTime, attempt = 0) {
//     const MAX_ATTEMPTS = 10; 
//     const RETRY_DELAY = 60000; 

//     if (attempt >= MAX_ATTEMPTS) {
//         console.log('Max attempts to fetch new webhook event reached.');
//         return null; 
//     }

//     const webhookData = await WebhooksService.fetchLatestFromWebhookSite(uuid);
//     const { processedEventData, isNewEvent } = processWebhookEvent(webhookData, startTime);

//     if (isNewEvent) {
//         return processedEventData; 
//     } else {
//         console.log(`Attempt ${attempt + 1}: Waiting for new webhook event...`);
//         await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
//         return waitForNewWebhookEvent(uuid, startTime, attempt + 1);
//     }
// }


