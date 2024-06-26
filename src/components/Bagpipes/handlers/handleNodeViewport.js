import { smoothZoom } from "../hooks/utils/scenarioExecutionUtils";

export const handleNodeViewport = async (instance, node, stage, orderedList ) => {
    console.log('[handleNodeViewport] ordered list:', orderedList);
    const { x, y } = node.position;
    const nodeWidth = node.width || 0 / 2;
    const nodeHeight = node.height || 0 / 2;

    const centerX = (x || 0) + nodeWidth / 2;
    const centerY = (y || 0) + nodeHeight / 2;

    // Determine zoom level based on node type
    let zoomLevel;
    switch (node.type) {
        case 'openAi':
            zoomLevel = 1.5;
            break;
        case 'chain':
            zoomLevel = 1.2; // You can adjust this as per your needs
            break;
        case 'action':
            zoomLevel = 1.8; // You can adjust this as per your needs
            break;
        default:
            zoomLevel = 1.5;
    }

    // Based on the stage, perform the relevant actions
    switch (stage) {
        case 'zoomIn':
            instance.setCenter(centerX, centerY);
            await smoothZoom(instance, zoomLevel, 1000);
            break;
        case 'hold':
            await new Promise((resolve) => setTimeout(resolve, 1000));
            break;
        case 'zoomOut':
            await smoothZoom(instance, 1.0, 1000);
            if (node === orderedList[orderedList.length - 1]) { // Check if it's the last node
                await new Promise((resolve) => setTimeout(resolve, 1000)); 
                instance.fitView();
            }
            break;
        default:
            console.error("Invalid stage provided to handleNodeViewport.");
            break;
    }
};
