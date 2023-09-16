import dotenv from 'dotenv';
import logger from '../logger.js';
import ExecutionLog from '../models/ExecutionLog.js';
import Execution from '../models/Execution.js';
import handleOpenAiNode from '../NodeHandlers/openAiHandler.js';
import { replacePlaceholders, getOrderedList } from '../utils/scenarioExecutionUtils.js';
import { saveExecutionLog } from '../utils/saveToDb.js';
import { saveExecution } from '../utils/saveToDb.js';

dotenv.config();

async function startScenarioExecution({ user, scenario, diagramData, executionId, req, validNodeIds=[] }) {
    console.log('Starting scenario execution, ', executionId);
    let nodeContent = '';
  try {
    if (!validNodeIds || !Array.isArray(validNodeIds)) {
        throw new Error("validNodeIds must be provided and should be an array");
      }

    try {
        console.log("User ID: ", user);
        saveExecutionLog({ executionId: executionId, nodeId: null, user: user, scenario: scenario, content: null, status: null, execution_status: 'Running' });
    } catch (error) {
        console.error('Error creating initial execution log:', error);
    }


    console.log('Starting scenario execution for executionId:', executionId);

     // Declare replacements and nodeIds here

     let nodeContents = {};
     let executionCycleFinished = false;

     // Get the ordered list of node IDs
     let orderedList = getOrderedList(diagramData.edges);
     console.log('ordered list:', orderedList);

     // If there's no next node, send a message to the client and end the execution
     if(!orderedList) {
         console.error('Could not create an ordered list of nodes. Aborting execution.');
         throw new Error("We couldn't validate the list order. Please review your scenario.");
     }

    // Iterate over the nodes in the order determined by orderedList
    for(let nodeId of orderedList) {
        // Check if the execution should be terminated
        let executionLog;
        console.log(`Looking for ExecutionLog with execution: ${executionId}`);
        try {
            executionLog = await ExecutionLog.findOne({ execution: executionId });
        } catch (error) {
            console.error(`Error finding ExecutionLog: ${error}`);
            // Handle error, maybe continue or break depending on your logic
        }
        if (executionLog && executionLog.execution_status === 'stopped') {
            console.log('Execution has been stopped.');
            break;
        }

        let currentNode = diagramData.nodes.find(node => node.id === nodeId);
        

        // If there's no next node, send a message to the client and end the execution
        if (!currentNode) {
            req.io.to(executionId).emit('endOfExecution', 'The execution has ended.');
            return;
        }

            // Handle generic placeholder replacement here
        for (let property in currentNode.formState) {
            if (typeof currentNode.formState[property] === 'string') {
                currentNode.formState[property] = replacePlaceholders(currentNode.formState[property], nodeContents);
            }
        }
            
        console.log(`Current node in the loop: ${currentNode.id}`);
        switch(currentNode.type) {
            
            case 'openAi': {
                const { concatenatedContent, executionLogStatus } = await handleOpenAiNode({
                // parameters for executing openAi node            
                });
                nodeContents[currentNode.id] = concatenatedContent;
    
                if (executionLogStatus === 'Stopped') {
                    nodeContents[currentNode.id] = concatenatedContent;
                    // Save the updated nodeContents to the Execution
                    console.log('Node Contens before saving execution: ', nodeContents);
                    await saveExecution({executionId, user, scenario, content: nodeContents});
                }
                break;
            }

            case 'chain': {
                // We need to add logic here to process the chain node, we would need to use the information from its 
                // formData, as well as be provided the action from action node. 
                console.log(`Chain node output: ${nodeContent}`);

                // we probably need to change the way we finish our execution cycle by referring to the ordered list 
                //and see where the current node sits in that list if it is at the end of the list then the execution 
                // cycle is finished, if not then it must continue. 
                executionCycleFinished = false; 
                break;  
            }
            case 'action': {
                // Do something with the output node here
                // You could return the content of the previous node
                console.log(`Final output: ${nodeContent}`);
                // req.io.to(executionId).emit('nodeOutput', nodeContent);

                // refer to what was side in chain about executionCyclefinished and how to handle it. 
                executionCycleFinished = false; 
                break;  
            }
        }
    }
     // All nodes have been processed
     if (executionCycleFinished) {
        // Your post-execution logic here
        console.log('Node Contents before saving execution: ', nodeContents);
        console.log('Execution Id in startExecuteScenario before req.io.to', executionId)
        req.io.to(executionId).emit('processingCompleted', { message: 'Workflow execution completed' });
        await saveExecution({executionId, user, scenario, status: 'Completed', content: nodeContents});
        console.log('execution id just as processing is completed.', executionId)
        console.log('[processingCompleted] Workflow execution completed');
        logger.info('[processingCompleted] Workflow execution completed');
    }
  } catch (error) {
    console.log('Failed to execute scenario:', error);
     // Update the execution status to 'Failed'
    // Try to update the execution status to 'Failed'

  try {
    await saveExecution({executionId, user, scenario, status: 'Failed', content: nodeContent || {}});
  } catch (saveError) {
    console.error('Failed to update execution status:', saveError);
    // Handle this failure appropriately, perhaps send another error message to the client
  }
    console.log('Execution Id in startExecuteScenario', executionId)
    logger.error(`Error executing scenario: ${error.message}`);

    // we can replace a lot of these io responses (which was for the server interaction) with Toast messages to show the user that status of the execution.
    req.io.to(executionId).emit('status', error.message);
    throw error;
  }
}


export default startScenarioExecution;
