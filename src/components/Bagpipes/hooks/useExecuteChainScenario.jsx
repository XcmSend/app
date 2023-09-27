// @ts-nocheck
import { useState, useContext, useEffect, useRef } from 'react';
import { useStoreApi } from 'reactflow';
import { getSavedFormState } from '../utils/storageUtils'; 
import ScenarioService from '../../../services/ScenarioService';
import { processScenarioData, validateDiagramData } from '../utils/scenarioUtils';
import SocketContext from '../../../contexts/SocketContext';
import useAppStore from '../../../store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { getOrderedList } from '../utils/scenarioUtils';
import { broadcastToChain } from '../../../Chains/api/broadcast';



const useExecuteChainScenario = (nodes, setNodes) => {
    const socket = useContext(SocketContext);
    const store = useStoreApi();
    const { scenarios, activeScenarioId, saveExecution, executionId, setActiveExecutionId, setExecutionId, updateNodeContent, setLoading, loading} = useAppStore(state => ({
      scenarios: state.scenarios,
      activeScenarioId: state.activeScenarioId,
      saveExecution: state.saveExecution,
      executionId: state.executionId,
      setActiveExecutionId: state.setActiveExecutionId,
      setExecutionId: state.setExecutionId,
      updateNodeContent: state.updateNodeContent,
      setLoading: state.setLoading,
      loading: state.loading,
      
    }));
    // const [executionId, setExecutionId] = useState(null);
    const [nodeContentMap, setNodeContentMap] = useState({}); 
    const [nodeContentHistory, setNodeContentHistory] = useState({});
    const [lastReceived, setLastReceived] = useState({});
    
    const prevExecutionIdRef = useRef(null);  

    useEffect(() => {
      if (socket == null) return; // Make sure the socket object is available


        if (executionId === prevExecutionIdRef.current) {
          return;
      }

      console.log("Client-side Execution ID before emitting joinRoom: ", executionId);

      socket.emit('joinRoom', executionId);
      prevExecutionIdRef.current = executionId; // Update the ref to the new executionId
  
     
      // Listen for 'message' events (real-time updates during processing)
      socket.on('message', ({ content, nodeId }) => {
        // console.log('[socket] Message event received', content, nodeId);


        if (!executionId) return;
      
        console.log(`Received update for node ${nodeId}:`, content);
      
        // Update nodeContentMap with the new content for the nodeId
        setNodeContentMap(prevNodeContentMap => {
          const existingContent = prevNodeContentMap[nodeId] || '';
          const updatedContent = existingContent + content;

          updateNodeContent(executionId, nodeId, updatedContent);

          return { ...prevNodeContentMap, [nodeId]: updatedContent };
        });

        // Set up a timer to periodically check the last received message:
        setLastReceived(prev => ({ ...prev, [nodeId]: Date.now() }));


      });
      
        // Listen for 'nodeOutput' events (final output for each node)
        socket.on('nodeOutput', ({ nodeId, content }) => {
          console.log(`[socket] Received final output for node ${nodeId}:`, content);
          if (!executionId) return;
          updateNodeContent(executionId, nodeId, content);
          // Add logic to update the corresponding node in the UI with its final output
          socket.emit('messageAcknowledged', { messageId: nodeId });


        });
      
        // Listen for 'processingCompleted' event
        socket.on('processingCompleted', (data) => {
          if (!executionId) return;
          console.log('[socket] processingCompleted', data.message);  
          // Update the nodes state
          // setNodes([...nodes]);
          saveExecution(executionId);
          setLoading(false);  

        });

        // Listen for 'status' events
        socket.on('status', (data) => {
          if (!executionId) return;
          console.log('[socket] Received status:', data);

          if (data.message === 'Workflow execution started') {
            // Handle the start of workflow execution
          } else if (data.message === 'Workflow execution failed') {
            console.log('Error:', data.error);
            // Handle the failure of workflow execution
          }
        });


        socket.on('updateClient', ({ nodeId, concatenatedContent }) => {
          if (!executionId) return;

          console.log(`[socket] Final content for node ${nodeId}:`, concatenatedContent);

          // You can update the UI here with the final concatenated content.
          setNodeContentMap(prevNodeContentMap => ({
            ...prevNodeContentMap,
            [nodeId]: concatenatedContent
          }));

        });

        return () => {
          socket.off('message');
          socket.off('nodeOutput');
          socket.off('processingCompleted');
          socket.off('updateClient');
          socket.off('status');

        };
      }, [executionId, socket]);
      
      // useEffect(() => {
      //     const timer = setInterval(() => {
      //         for (let [node, timestamp] of Object.entries(lastReceived)) {
      //             if (Date.now() - timestamp > 1500) { // 1.5 seconds
      //                 // Fetch missing data for this node
      //                 fetchMissingData(node);
      //             }
      //         }
      //     }, 500); // Check every 0.5 seconds, but you can adjust this as needed

      //     return () => clearInterval(timer); // Cleanup on unmount
      // }, [lastReceived]);


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
    toast('Starting Workflow Execution...');
    console.log('[executeChainScenario] Starting Workflow Execution...');
    setLoading(true);

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
                formState: getSavedFormState(node.id) || {},  
            })),
            edges: rawDiagramData.edges.map(edge => ({ ...edge })),
        };
        
        console.log('[executeChainScenario] Retrieved diagramData from state:', diagramData);

        const executionId = uuidv4();
        setExecutionId(executionId);
       
        
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
        toast.success('Running Scenario...');

        let nodeContents = {};
        let executionCycleFinished = false;

        // Iterate over the nodes based on the order from orderedList
        for(let index = 0; index < orderedList.length; index++) {
            let nodeId = orderedList[index];
            let currentNode = diagramData.nodes.find(node => node.id === nodeId);
            if (!currentNode) {
                toast.error('The execution has ended due to an unknown node.');
                return;
            }

            switch(currentNode.type) {
            case 'openAi':
                // Handle the openAi node execution
                break;

            case 'chain':
                toast.success('Executing Chain Node...');
                // Handle the chain node execution
                break;

            case 'action':
                toast('Executing action node!', {
                    icon: '💥',
                });


                // Retrieve the signedExtrinsic from the current node data
                const signedExtrinsic = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData?.signedExtrinsic || null;
                const chain = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData?.actionData?.source?.chain || null; 
                console.log('executeChainScenario Signed Extrinsic:', signedExtrinsic);
                console.log('executeChainScenario Chain:', chain);

                if(signedExtrinsic) {
                    await broadcastToChain(chain, signedExtrinsic); 

                }
                // if it's the last iteration and set executionCycleFinished accordingly
                executionCycleFinished = index === orderedList.length - 1; 
                break;
            }
        }


      if (executionCycleFinished) {
         toast.success('Workflow Execution Completed! The execution cycle has finished.');
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
        }
    };
    return { nodeContentMap, executeChainScenario, stopExecution };
};

export default useExecuteChainScenario;
