// @ts-nocheck

import toast  from "react-hot-toast";


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

export function processAndSanitizeFormData(formData, executionData, upstreamNodeIds) {
    // Define the pill regex pattern
    const pillRegex = /<span[^>]*data-id="([^"]+)"[^>]*data-nodeindex="(\d+)"[^>]*>([^<]+)<\/span>/g;

    // Sanitize and remove unnecessary HTML tags, except for <span class="pill">...
    function sanitizeValue(value) {
        let sanitizedValue = value.replace(/<div[^>]*>(.*?)<\/div>/g, "$1");
        sanitizedValue = sanitizedValue.replace(/<span(?![^>]*class="pill")[^>]*>(.*?)<\/span>/g, "$1");
        return sanitizedValue;
    }

    // Replace pills with their actual values from execution data
    function replacePills(value) {
        return value.replace(pillRegex, (match, dataId, nodeIndexStr) => {
            const nodeIndex = parseInt(nodeIndexStr, 10) - 1;
            if (nodeIndex < 0 || nodeIndex >= upstreamNodeIds.length) {
                console.error(`Node index ${nodeIndex} out of bounds for upstream nodes.`);
                return match; // Return original pill markup if nodeIndex is out of bounds
            }

            const nodeId = upstreamNodeIds[nodeIndex];
            const eventData = executionData[nodeId]?.responseData?.eventUpdates?.slice(-1)[0]?.eventData;
            if (!eventData) {
                console.error(`No eventData found for node: ${nodeId}`);
                return match; // Return original pill markup if no event data found
            }

            const pathParts = dataId.split('.');
            let actualValue = eventData;
            for (const part of pathParts) {
                if (actualValue && actualValue.hasOwnProperty(part)) {
                    actualValue = actualValue[part];
                } else {
                    console.error(`Path not found in eventData for node ${nodeId}: ${dataId}`);
                    return match; // Return original pill markup if path not found
                }
            }

            return typeof actualValue === 'object' ? JSON.stringify(actualValue) : actualValue;
        });
    }

    // Recursively apply sanitization and pill replacement to strings, arrays, and object values
    function recursiveProcess(value) {
        if (typeof value === 'string') {
            let sanitizedValue = sanitizeValue(value);
            return replacePills(sanitizedValue);
        } else if (Array.isArray(value)) {
            return value.map(item => {
                if (typeof item === 'object') {
                    return recursiveProcess(item); // Recursively process each item if it's an object
                } else if (typeof item === 'string') {
                    return recursiveProcess(item); // Apply pill replacement directly if it's a string
                }
                return item;
            });
        } else if (typeof value === 'object' && value !== null) {
            const processedObject = {};
            for (const [key, val] of Object.entries(value)) {
                processedObject[key] = recursiveProcess(val); // Apply recursively for nested objects
            }
            return processedObject;
        }
        return value; // Non-string, non-array, and non-object values are returned as-is
    }

    // Apply the recursive processing to each field in formData
    const processedFormData = {};
    for (const [key, value] of Object.entries(formData)) {
        processedFormData[key] = recursiveProcess(value);
    }

    return processedFormData;
}


export function sanitizeFormData(formData) {
    const cleanFormData = {};
    Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (typeof value === 'string') {
            // Remove all <div> tags and their content
            let sanitizedValue = value.replace(/<div[^>]*>(.*?)<\/div>/g, "$1");
            
            // Remove all <span> tags except those with class="pill"
            sanitizedValue = sanitizedValue.replace(/<span(?![^>]*class="pill")[^>]*>(.*?)<\/span>/g, "$1");

            cleanFormData[key] = sanitizedValue;
        } else {
            // For non-string fields, copy as is
            cleanFormData[key] = value;
        }
    });
    console.log('Sanitized form data:', cleanFormData);
    return cleanFormData;
}


export function parseAndReplacePillsInFormData(formData, executionData, upstreamNodeIds) {
    const pillRegex = /<span[^>]*data-id="([^"]+)"[^>]*data-nodeindex="(\d+)"[^>]*>([^<]+)<\/span>/g;

    function getLatestEventDataForNode(nodeId) {
        // Assuming the latest event update is the last item in the eventUpdates array
        return executionData[nodeId]?.responseData?.eventUpdates?.slice(-1)[0]?.eventData;
    }

    function replacePills(value) {
        return value.replace(pillRegex, (match, dataId, nodeIndexStr) => {
            const nodeIndex = parseInt(nodeIndexStr, 10) - 1; // Convert 1-based index to 0-based
            if (nodeIndex < 0 || nodeIndex >= upstreamNodeIds.length) {
                console.error(`Node index ${nodeIndex} out of bounds for upstream nodes.`);
                return match; // Return original pill markup if nodeIndex is out of bounds
            }

            const nodeId = upstreamNodeIds[nodeIndex];
            const latestEventData = getLatestEventDataForNode(nodeId);
            if (!latestEventData) {
                console.error(`No eventData found for node: ${nodeId}`);
                return match; // Return original pill markup if no event data found
            }

            // Navigate through the eventData based on dataId
            const pathParts = dataId.split('.');
            let actualValue = latestEventData;
            for (const part of pathParts) {
                if (actualValue && actualValue.hasOwnProperty(part)) {
                    actualValue = actualValue[part];
                } else {
                    console.error(`Path not found in eventData for node ${nodeId}: ${dataId}`);
                    return match; // Return original pill markup if path not found
                }
            }

            console.log(`Replacement found for ${dataId} in node ${nodeId}:`, actualValue);
            return typeof actualValue === 'object' ? JSON.stringify(actualValue) : actualValue;
        });
    }

    // Recursively apply pill replacement to strings, arrays, and object values
    function applyReplacement(value) {
        if (typeof value === 'string') {
            return replacePills(value);
        } else if (Array.isArray(value)) {
            return value.map(item => applyReplacement(item));
        } else if (typeof value === 'object' && value !== null) {
            return Object.entries(value).reduce((acc, [key, val]) => {
                acc[key] = applyReplacement(val);
                return acc;
            }, {});
        }
        return value;
    }

    // Apply pill replacement to each field in formData
    return Object.entries(formData).reduce((acc, [key, value]) => {
        acc[key] = applyReplacement(value);
        return acc;
    }, {});
}



//     // Apply pill replacement to each field in formData
//     const parsedFormData = {};
//     Object.entries(formData).forEach(([key, value]) => {
//         if (typeof value === 'string') {
//             parsedFormData[key] = replacePills(value, upstreamNodeIds);
//         } else if (Array.isArray(value)) {
//             // If value is an array, apply replacePills to each element
//             parsedFormData[key] = value.map(item => typeof item === 'string' ? replacePills(item) : item);
//         } else {
//             // Non-string and non-array values are copied as-is
//             parsedFormData[key] = value;
//         }
//     });

//     return parsedFormData;
// }


export function getUpstreamNodeIds(orderedList, currentNodeId) {
    const currentIndex = orderedList.indexOf(currentNodeId);
    if (currentIndex === -1) {
        console.error(`Node ID ${currentNodeId} not found in the ordered list.`);
        return [];
    }

    // Slice the ordered list up to the current index to get all upstream node IDs
    const upstreamNodeIds = orderedList.slice(0, currentIndex);
    console.log('Upstream node IDs:', upstreamNodeIds);
    return upstreamNodeIds;
}



