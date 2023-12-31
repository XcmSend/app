// @ts-nocheck
import { useState, useContext, useEffect, useRef } from 'react';
import { useStoreApi } from 'reactflow';
import { getSavedFormState } from '../utils/storageUtils'; 
import ScenarioService from '../../../services/ScenarioService';
import { processScenarioData, validateDiagramData } from '../utils/scenarioUtils';
import SocketContext from '../../../contexts/SocketContext';
import useAppStore from '../../../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import toast  from 'react-hot-toast';
import { getOrderedList } from './utils/scenarioExecutionUtils';
import { handleNodeViewport } from '../handlers/handleNodeViewport';
import { broadcastToChain } from '../../../Chains/api/broadcast';
import { ChainToastContent, ActionToastContent } from '../../toasts/CustomToastContext'



const useExecuteChainScenario = (nodes, setNodes, instance) => {
    const socket = useContext(SocketContext);
    const store = useStoreApi();
    const { scenarios, activeScenarioId, saveExecution, executionId, setActiveExecutionId, setExecutionId, updateNodeContent, setLoading, loading, toggleExecuteChainScenario, executionState, setExecutionState, saveTriggerNodeToast, updateEdgeStyleForNode } = useAppStore(state => ({
      scenarios: state.scenarios,
      activeScenarioId: state.activeScenarioId,
      saveExecution: state.saveExecution,
      executionId: state.executionId,
      setActiveExecutionId: state.setActiveExecutionId,
      setExecutionId: state.setExecutionId,
      updateNodeContent: state.updateNodeContent,
      setLoading: state.setLoading,
      loading: state.loading,
      toggleExecuteChainScenario: state.toggleExecuteChainScenario,
      executionState: state.executionState,
      setExecutionState: state.setExecutionState,
      saveTriggerNodeToast: state.saveTriggerNodeToast,
      updateEdgeStyleForNode: state.updateEdgeStyleForNode,

      
    }));
    // const [executionId, setExecutionId] = useState(null);
    const [nodeContentMap, setNodeContentMap] = useState({}); 
    const [nodeContentHistory, setNodeContentHistory] = useState({});
    const [lastReceived, setLastReceived] = useState({});
    
    const prevExecutionIdRef = useRef(null);  

    const executedIds = useRef(new Set()).current;


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

  async function executeChainScenario() {
    if (executedIds.has(executionId)) {
        console.log(`Already executed scenario for executionId: ${executionId}. Skipping...`);
        return;
      }
      toast('Starting Workflow Execution...', { 
        id: 'workflow-start',
        duration: 5000,
    
    });
      console.log('[executeChainScenario] Starting Workflow Execution...');
    // setLoading(true);

    // Clear the nodeContentMap before starting a new execution
    setNodeContentMap({});

    try {

        const rawDiagramData = store.getState();
        console.log('[executeChainScenario] rawDiagramData:', rawDiagramData);

        // Simplify the diagramData
        let diagramData = {
            nodes: rawDiagramData.getNodes().map(node => ({ 
                id: node.id, 
                type: node.type, 
                data: node.data, 
                position: node.position,
                formState: getSavedFormState(node.id) || {}, 
                height: node.height,
                width: node.width,   
            })),
            edges: rawDiagramData.edges.map(edge => ({ ...edge })),
        };
        
        console.log('[executeChainScenario] Retrieved diagramData from state:', diagramData);

        // const executionId = uuidv4();
        // setExecutionId(executionId);
       
        
        // Get the ordered list of nodes
        const orderedList = getOrderedList(diagramData.edges);
        console.log('[executeChainScenario] Ordered List of Nodes:', orderedList);


        if (!orderedList) {
            toast.error('Error during ordering of nodes. Check the scenario.');
            return;
        }

        // Validate the diagramData
        diagramData = validateDiagramData(diagramData);
                
        console.log("[executeChainScenario] About to run the scenario with the following data:", { diagramData: diagramData, scenario: activeScenarioId });
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
                console.log('executeChainScenario currentNode position:', currentNode.position);
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
            

                console.log('executeChainScenario currentNode:', executionState, currentNode.id);

                // Retrieve the signedExtrinsic from the current node data
                const formData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData || null;
                const signedExtrinsic = formData?.signedExtrinsic || null;
                const actionData = formData?.actionData || null; 
                const sourceChain = actionData?.source?.chain || null;
                const targetChain = actionData?.target?.chain || null;  
                const sourceAsset = actionData?.source?.asset || null;
                const targetAsset = actionData?.target?.asset || null;

                // TODO: if action type is swap then show swap stuff and if type is xTransfer show xTransfer stuff    


                console.log('executeChainScenario Signed Extrinsic:', signedExtrinsic);
                console.log('executeChainScenario Chain:', sourceChain);

                if(signedExtrinsic) {
                    await broadcastToChain(sourceChain, signedExtrinsic); 
                }
                toast(<ActionToastContent type={actionData.actionType} message={`executeChainScenario Broadcasted to Chain: ${sourceChain}`} signedExtrinsic={signedExtrinsic} />);

                console.log('executeChainScenario Broadcasted to Chain:', signedExtrinsic );
                // if it's the last iteration and set executionCycleFinished accordingly
                executionCycleFinished = index === orderedList.length - 1; 
                
                updateEdgeStyleForNode(currentNode.id, 'default_connected');

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
      }

            if (executionId) {

              const currentDateTime = new Date().toISOString();

              const executionData = {
                  timestamp: currentDateTime,
                  nodeContentMap: { ...nodeContentMap },
              };
              console.log('Saving execution data...');
              saveExecution(executionId, executionData);
            } else {
              console.error('No executionId received from the server. Cannot save execution.');
          }
        } catch (error) {
            console.error('An error occurred while executing the workflow:', error);
        } finally {
            console.log('Workflow Execution Prepared and Sent to Server...');
            setNodes([...nodes]);
            executedIds.add(executionId);
            toggleExecuteChainScenario();
            setExecutionState('idle');
            console.log('Workflow Execution Prepared and set to idle and toggled...', executionState, toggleExecuteChainScenario);
        }
    };
    return { nodeContentMap, executeChainScenario, stopExecution };
};

export default useExecuteChainScenario;
