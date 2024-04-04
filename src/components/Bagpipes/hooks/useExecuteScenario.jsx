// @ts-nocheck
import { useState, useContext, useEffect, useRef } from 'react';
import { useStoreApi } from 'reactflow';
import { getSavedFormState } from '../utils/storageUtils'; 
import ScenarioService from '../../../services/ScenarioService';
import { processScenarioData, validateDiagramData } from '../utils/scenarioUtils';
import SocketContext from '../../../contexts/SocketContext';
import useAppStore from '../../../store/useAppStore';


const useExecuteScenario = (nodes, setNodes) => {
    const socket = useContext(SocketContext);
    const store = useStoreApi();
    const { scenarios, activeScenarioId, saveExecution, executionId, setExecutionId, updateNodeContent, setLoading, loading} = useAppStore(state => ({
      scenarios: state.scenarios,
      activeScenarioId: state.activeScenarioId,
      saveExecution: state.saveExecution,
      executionId: state.executionId,
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

    // useEffect(() => {
    //   if (socket == null) return; // Make sure the socket object is available


    //     if (executionId === prevExecutionIdRef.current) {
    //       return;
    //   }

    //   console.log("Client-side Execution ID before emitting joinRoom: ", executionId);

    //   socket.emit('joinRoom', executionId);
    //   prevExecutionIdRef.current = executionId; // Update the ref to the new executionId
  
     
    //   // Listen for 'message' events (real-time updates during processing)
    //   socket.on('message', ({ content, nodeId }) => {
    //     // console.log('[socket] Message event received', content, nodeId);


    //     if (!executionId) return;
      
    //     console.log(`Received update for node ${nodeId}:`, content);
      
    //     // Update nodeContentMap with the new content for the nodeId
    //     setNodeContentMap(prevNodeContentMap => {
    //       const existingContent = prevNodeContentMap[nodeId] || '';
    //       const updatedContent = existingContent + content;

    //       updateNodeContent(executionId, nodeId, updatedContent);

    //       return { ...prevNodeContentMap, [nodeId]: updatedContent };
    //     });

    //     // Set up a timer to periodically check the last received message:
    //     setLastReceived(prev => ({ ...prev, [nodeId]: Date.now() }));


    //   });
      
    //     // Listen for 'nodeOutput' events (final output for each node)
    //     socket.on('nodeOutput', ({ nodeId, content }) => {
    //       console.log(`[socket] Received final output for node ${nodeId}:`, content);
    //       if (!executionId) return;
    //       updateNodeContent(executionId, nodeId, content);
    //       // Add logic to update the corresponding node in the UI with its final output
    //       socket.emit('messageAcknowledged', { messageId: nodeId });


    //     });
      
    //     // Listen for 'processingCompleted' event
    //     socket.on('processingCompleted', (data) => {
    //       if (!executionId) return;
    //       console.log('[socket] processingCompleted', data.message);  
    //       // Update the nodes state
    //       // setNodes([...nodes]);
    //       saveExecution(executionId);
    //       setLoading(false);  

    //     });

    //     // Listen for 'status' events
    //     socket.on('status', (data) => {
    //       if (!executionId) return;
    //       console.log('[socket] Received status:', data);

    //       if (data.message === 'Workflow execution started') {
    //         // Handle the start of workflow execution
    //       } else if (data.message === 'Workflow execution failed') {
    //         console.log('Error:', data.error);
    //         // Handle the failure of workflow execution
    //       }
    //     });


    //     socket.on('updateClient', ({ nodeId, concatenatedContent }) => {
    //       if (!executionId) return;

    //       console.log(`[socket] Final content for node ${nodeId}:`, concatenatedContent);

    //       // You can update the UI here with the final concatenated content.
    //       setNodeContentMap(prevNodeContentMap => ({
    //         ...prevNodeContentMap,
    //         [nodeId]: concatenatedContent
    //       }));

    //     });

    //     return () => {
    //       socket.off('message');
    //       socket.off('nodeOutput');
    //       socket.off('processingCompleted');
    //       socket.off('updateClient');
    //       socket.off('status');

    //     };
    //   }, [executionId, socket]);
      
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

    async function executeScenario() {
        console.log('[executeScenario] Starting Workflow Execution...');
        // setLoading(true);

        if (!socket.connected) {
            console.error('Unable to execute scenario: socket is not connected');
            // You can notify the user about the connection issue here...
            return;
        }

        // Clear the nodeContentMap before starting a new execution
        setNodeContentMap({});

        console.log('[executeScenario] setLoading (loading) at the start of executeScenario', loading)

        try {
            const rawDiagramData = store.getState();
            console.log('[executeScenario] rawDiagramData:', rawDiagramData);
            // Simplify the diagramData to include only necessary information
            let diagramData = {
                nodes: rawDiagramData.getNodes().map(node => ({ 
                    id: node.id, 
                    type: node.type, 
                    data: node.data, 
                    formState: getSavedFormState(node.id) || {},  // Add the form state for each node
                })),
                edges: rawDiagramData.edges.map(edge => ({ ...edge })),
            };
    
            console.log('[executeScenario] Retrieved diagramData from state:', diagramData);
    
            // Validate the diagramData before processing
            diagramData = validateDiagramData(diagramData);
    
            // Process the diagram data before sending it to the server
            diagramData = processScenarioData(diagramData);
            console.log('[executeScenario] Processed diagramData:', diagramData);
    

            console.log("[executeScenario] About to run the scenario with the following data:", { diagramData: diagramData, scenario: activeScenarioId });

            // the response should provide the executionId
            const response = await ScenarioService.runOnce({ 
              diagramData: diagramData,
              scenario: activeScenarioId,
            
            });  
            setExecutionId(response.executionId);


            console.log('[executeScenario], Workflow execution result:', response.executionId); 
            
            if (response.executionId) {

              // setExecutionId(response.executionId); 

              const currentDateTime = new Date().toISOString();

              const executionData = {
                  timestamp: currentDateTime,
                  nodeContentMap: { ...nodeContentMap },
              };
              console.log('Saving execution data...');
              saveExecution(response.executionId, executionData);
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
    return { nodeContentMap, executeScenario, stopExecution };
};

export default useExecuteScenario;
