// @ts-nocheck
import { useState, useContext, useEffect, useRef } from 'react';
import { useStoreApi } from 'reactflow';
import { getSavedFormState } from '../utils/storageUtils'; 
import ScenarioService from '../../../services/ScenarioService';
import NodeExecutionService from '../../../services/NodeExecutionService';
import { processScenarioData, validateDiagramData, processAndSanitizeFormData, parseAndReplacePillsInFormData, sanitizeFormData, getUpstreamNodeIds } from '../utils/scenarioUtils';
import { fetchNodeExecutionData, fetchAllExecutionsForScenario, processWebhookEvent } from './utils/scenarioExecutionUtils';
import SocketContext from '../../../contexts/SocketContext';
import WebhooksService from '../../../services/WebhooksService';
import useAppStore from '../../../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import toast  from 'react-hot-toast';
import { getOrderedList } from './utils/scenarioExecutionUtils';
import { handleNodeViewport } from '../handlers/handleNodeViewport';
import { broadcastToChain } from '../../../Chains/api/broadcast';
import { ChainToastContent, ActionToastContent, CustomToastContext } from '../../toasts/CustomToastContext'



const useExecuteFlowScenario = (nodes, setNodes, instance) => {
    const socket = useContext(SocketContext);
    const store = useStoreApi();
    const { scenarios, activeScenarioId, saveExecution, executionId, setExecutionId, updateNodeContent, setLoading, loading, toggleExecuteFlowScenario, executionState, setExecutionState, saveTriggerNodeToast, updateEdgeStyleForNode, updateNodeResponseData } = useAppStore(state => ({
      scenarios: state.scenarios,
      activeScenarioId: state.activeScenarioId,
      saveExecution: state.saveExecution,
      executionId: state.executionId,
      setExecutionId: state.setExecutionId,
      updateNodeContent: state.updateNodeContent,
      setLoading: state.setLoading,
      loading: state.loading,
      toggleExecuteFlowScenario: state.toggleExecuteFlowScenario,
      executionState: state.executionState,
      setExecutionState: state.setExecutionState,
      saveTriggerNodeToast: state.saveTriggerNodeToast,
      updateEdgeStyleForNode: state.updateEdgeStyleForNode,
      updateNodeResponseData: state.updateNodeResponseData,
    }));
    const [nodeContentMap, setNodeContentMap] = useState({}); 
    const [nodeContentHistory, setNodeContentHistory] = useState({});
    const [lastReceived, setLastReceived] = useState({});
    const [executionStatuses, setExecutionStatuses] = useState({});
    const prevExecutionIdRef = useRef(null);  
    const executedIds = useRef(new Set()).current;

    async function executeFlowScenario() {
      const newExecutionId = uuidv4(); 
      console.log('executeFlowScenario newExecutionId:', newExecutionId);
      saveExecution(newExecutionId);

      toast('Starting Workflow Execution...', { id: 'workflow-start',duration: 5000 });
      setLoading(true);
      setNodeContentMap({});

      try {

        const rawDiagramData = store.getState();
        console.log('[executeFlowScenario] rawDiagramData:', rawDiagramData);

        // Simplify the diagramData
        let diagramData = {
            nodes: rawDiagramData.getNodes().map(node => ({ 
                id: node.id, 
                type: node.type, 
                data: node.data, 
                position: node.position,
                formData: node.formData,
                eventData: node.eventData,
                formState: getSavedFormState(node.id) || {}, 
                height: node.height,
                width: node.width,   
            })),
            edges: rawDiagramData.edges.map(edge => ({ ...edge })),
        };
        
        console.log('[executeFlowScenario] Retrieved diagramData from state:', diagramData);

        // const executionId = uuidv4();
        // setExecutionId(executionId);
       
        
        // Get the ordered list of nodes
        const orderedList = getOrderedList(diagramData.edges);
        console.log('[executeFlowScenario] Ordered List of Nodes:', orderedList);


        if (!orderedList) {
            toast.error('Error during ordering of nodes. Check the scenario.');
            return;
        }

        // Initialize execution data in the store with nodes
        // console.log(`Initializing execution for ID: ${executionId} with initial node data`);
        // saveExecution(executionId);


        // Validate the diagramData
        diagramData = validateDiagramData(diagramData);
                
        console.log("[executeFlowScenario] About to run the scenario with the following data:", { diagramData: diagramData, scenario: activeScenarioId });
        toast.success('Running Scenario...', { id: 'running-scenario' });

        let nodeContents = {};
        let executionCycleFinished = false;


        // Iterate over the nodes based on the order from orderedList
        for(let index = 0; index < orderedList.length; index++) {
            let nodeId = orderedList[index];
            let currentNode = diagramData.nodes.find(node => node.id === nodeId);
          
            if (!currentNode) {
                toast.error('The execution has ended due to an unknown node.', { id: 'unknown-node' });
                return;
            }

            switch(currentNode.type) {
            case 'openAi':
                // Handle the openAi node execution

                break;

            case 'chain':

                // we don't need to execute a chain node so it doesnt make sense to zoom into it. 
                // toast('Executing Chain Node...', { id: 'execution-chain' });
                updateEdgeStyleForNode(currentNode.id, 'executing');

                //  // Zoom into the current node
                // await handleNodeViewport(instance, currentNode, 'zoomIn', orderedList);
                
                updateEdgeStyleForNode(currentNode.id, 'default_connected');

                break;

            case 'action':
                console.log('executeFlowScenario currentNode position:', currentNode.position);
                updateEdgeStyleForNode(currentNode.id, 'executing');
            
                toast('Executing action!', {
                    icon: '💥',
                    id: 'execution-action',
                    data: {
                        position: currentNode.position
                    },
                    visible: true,
                    zIndex: 100000,
                });
            
                currentNode.data.triggerToast = true;
                saveTriggerNodeToast(activeScenarioId, currentNode.id, true);
            
                // Zoom into the current node
                await handleNodeViewport(instance, currentNode, 'zoomIn', orderedList);
            
                console.log('executeFlowScenario currentNode:', executionState, currentNode.id);
            
                // Retrieve the signedExtrinsic and other necessary data
                const formData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData || null;
                const signedExtrinsic = formData?.signedExtrinsic || null;
                const sourceChain = formData?.actionData?.source?.chain || null;
            
                try {
                    await broadcastToChain(sourceChain, signedExtrinsic, {
                        onInBlock: (blockHash) => {
                            console.log(`Transaction included at blockHash: ${blockHash}`);

                            toast.success(`Transaction included at blockHash: ${blockHash}`);
                            // Update global state in Zustand store


                            updateNodeResponseData(activeScenarioId, executionId, nodeId, { inBlock: blockHash });

                        },
                        onFinalized: (blockHash) => {
                            toast.success(`Transaction finalized at blockHash: ${blockHash}`);
                            // Update global state in Zustand store
                            updateNodeResponseData(activeScenarioId, executionId, nodeId, { finalized: blockHash });
                        },
                        onError: (error) => {
                            toast.error(`Action execution failed: ${error.message}`);
                            setLoading(false);
                            // Update global state in Zustand store
                            updateNodeResponseData(activeScenarioId, executionId, nodeId, { error: error.message });
                        },
                    });
                } catch (error) {
                    // This catch block is for handling errors not caught by the onError callback, e.g., network issues
                    toast.error(`Error broadcasting transaction: ${error.message}`);
                    setLoading(false);
                }
            
                toast(<ActionToastContent type={formData?.actionData?.actionType} message={`Broadcasted to Chain: ${sourceChain}`} signedExtrinsic={signedExtrinsic} />);
            
                console.log('Broadcasted to Chain:', signedExtrinsic);
                // Check if it's the last iteration to set executionCycleFinished accordingly
                executionCycleFinished = index === orderedList.length - 1;
            
                updateEdgeStyleForNode(currentNode.id, 'default_connected');
            
                break;  

            case 'webhook':
                updateEdgeStyleForNode(currentNode.id, 'executing');
                console.log('executeFlowScenario for webhook event...', currentNode);
                try {
                    const webhookData = await WebhooksService.fetchLatestFromWebhookSite(currentNode.formData.uuid);
                    console.log('executeFlowScenario Webhook data received:', webhookData);
                    const processedEventData = processWebhookEvent(webhookData);
                    console.log('[webhook] executionId:', executionId);
                    updateNodeResponseData(activeScenarioId, executionId, currentNode.id, { eventData: processedEventData });
                    console.log('Updated Node Response Data:', processedEventData);
                } catch (error) {
                    console.error('Error waiting for webhook data:', error);
                    updateNodeResponseData(activeScenarioId, executionId, currentNode.id, { error: error.message });
                }
                updateEdgeStyleForNode(currentNode.id, 'default_connected');
                // Check if it's the last iteration to set executionCycleFinished accordingly
                executionCycleFinished = index === orderedList.length - 1;
                break;
            
                
            case 'http':
                updateEdgeStyleForNode(currentNode.id, 'executing');
                console.log('executeFlowScenario for http event...', currentNode.id, currentNode);
                // assuming we have the scenarios object and the activeScenarioId available
                const executions = fetchAllExecutionsForScenario(scenarios, activeScenarioId);
                console.log('All Executions:', executions, executionId);
                let parsedFormData;
                let activeExecutionData = {};

                if (executions) {
                    const upstreamNodeIds = getUpstreamNodeIds(orderedList, currentNode.id);
                    console.log('executionId:', executionId);
                    activeExecutionData = executions[executionId];
                    console.log('Active Execution Data:', activeExecutionData);


                    // Assuming currentNode.formData contains the data to be parsed
                    parsedFormData = processAndSanitizeFormData(currentNode.formData, activeExecutionData, upstreamNodeIds);
                    console.log('Parsed Form Data:', parsedFormData);
                    // parsedFormData should contain the formData with pills replaced by actual data
                } else {
                    // Handle the case where there are no executions or if fetching them failed
                    console.error('No executions found for the scenario');
                    return; // Exit from the case or handle this scenario appropriately
                }

                // Extract URL, method, and other necessary fields from parsedFormData
                // const { url: parsedUrl, method, ...otherParams } = parsedFormData;
            
                try {
                    // Execute the HTTP request with the parsed URL and formData
                    const httpResponse = await NodeExecutionService.executeHttpRequest(parsedFormData);
                    console.log('HTTP Response:', httpResponse);

                    const currentEventUpdates = activeExecutionData[currentNode.id].responseData.eventUpdates;
                    const eventUpdatesCount = activeExecutionData[currentNode.id].responseData.eventUpdates.length;


                    // Show toast notification for HTTP request execution
                    // Ensure we are correctly passing the 'eventUpdates' for the current node
                    toast(<CustomToastContext nodeType="http" eventUpdates={currentEventUpdates} />);


                    // Update node response data with the HTTP response
                    updateNodeResponseData(activeScenarioId, executionId, currentNode.id, { eventData: httpResponse.data, status: httpResponse.status, statusText: httpResponse.statusText, headers: httpResponse.headers, cookies: httpResponse.cookies, hasNotification: true, eventUpdatesCount });
                } catch (error) {
                    console.error('Error executing HTTP request:', error);
                    updateNodeResponseData(activeScenarioId, executionId, currentNode.id, { error: error.message });
                }
            
                updateEdgeStyleForNode(currentNode.id, 'default_connected');
                // Check if it's the last iteration to set executionCycleFinished accordingly
                executionCycleFinished = index === orderedList.length - 1;
                break;
            }

                // Hold view
                await handleNodeViewport(instance, currentNode, 'hold', orderedList);


                // Zoom out
                await handleNodeViewport(instance, currentNode, 'zoomOut', orderedList);


        }


        if (executionCycleFinished) {
            toast.success('Workflow Execution Completed! The execution cycle has finished.', { id: 'execution-finished' });
            setLoading(false); 
            setExecutionState('idle');
            updateEdgeStyleForNode(currentNode.id, 'default_connected');

        }
        } catch (error) {
            console.error('An error occurred while executing the workflow:', error);
        } finally {
            console.log('Workflow Execution Prepared and Sent to Server...');
            setNodes([...nodes]);
            executedIds.add(executionId);
            toggleExecuteFlowScenario();
            setExecutionState('idle');
            console.log('Workflow Execution Prepared and set to idle and toggled...', executionState, toggleExecuteFlowScenario);
        }
    };

    const fetchMissingData = async (nodeId) => {
        try {
            const data = await ScenarioService.fetchMissingData(executionId);  // Using the executionId here
            // Handle the received data
            
            // Clear the timestamp for this nodeId so we don't keep fetching
            setLastReceived(prev => {
                const updated = { ...prev };
                delete updated[nodeId];
                return updated;
            });
            
        } catch (error) {
            console.error(`Failed to fetch missing data for node ${nodeId}`, error);
        }
    }

    async function stopExecution() {
      try {
        console.log('Stopping execution...');
          const response = await ScenarioService.stopExecution(executionId);
          console.log('Stopped execution:', response);
          setLoading(false);  // Reset to false when an error occurs

      } catch (error) {
          console.error('Error stopping the execution:', error);
          setLoading(false);  // Reset to false when an error occurs

      }
    }


    return { nodeContentMap, executeFlowScenario, stopExecution };
};

export default useExecuteFlowScenario;
