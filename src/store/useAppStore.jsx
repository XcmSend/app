import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand'
import zukeeper from 'zukeeper';
import { loadScenarioAsync } from './AsyncHelpers';
import { EDGE_STYLES } from './reactflow/onConnect';

const defaultState = {
  scenarios: {},
  persistedScenarios: {},
  activeScenarioId: null,
  executions: {},
  executionId: null,
  nodeConnections: {},
  tempEdge: null,
  activeExecutionId: null,
  loading: false,
  userMetadata: {},
  csrfToken: null,
  chainAddresses: [],
  isModaVisible: false,
  transactions: [],
  shouldExecuteFlowScenario: false,
  executionState: 'idle', // can be 'idle', 'executing', 'stopped'
  toastPosition: null,
  hrmpChannels: {},
  currentNodeState: 'default_connected',
  selectedWebhook: null,
  webhooks: [],
  webhookDecision: {
    isPending: false,
    nodeId: null,
    decision: null, // 'processNow' or 'waitForNew', null initially
  },
  decisionPrompt: { nodeId: null, show: false },
  isLoadingNode: false,
  isExecuting: false,
  nodeLoadingStates: {},
  
};

const useAppStore = create(
  persist(
    zukeeper((set, get) => ({
      ...defaultState,
      resetState: () => set(() => ({ ...defaultState })),
      setCsrfToken: (token) => set(() => ({ csrfToken: token })),
      setUserMetadata: (metadata) => set({ userMetadata: metadata }),
      setLoading: (state) => set({ loading: state }),
      setTransactions: (transactions) => set({ transactions }),
      setExecutionId: (id) => set( { executionId: id }),
      setIsExecuting: (isExecuting) => {
        console.log("[setIsExecuting] Called with:", isExecuting);
        set(() => ({ isExecuting }));

      },
      startExecution: () => set(() => ({ isExecuting: true })),
      stopExecution: () => set(() => ({ isExecuting: false })),
      setTempEdge: (tempEdge) => set({ tempEdge }),
      setIsModalVisible: (visibility) => set({ isModalVisible: visibility }),
      setActiveScenarioId: (scenarioId) => {
        console.log("[setActiveScenarioId] Called with:", scenarioId);
        
        set(() => {
            console.log("[setActiveScenarioId] Updated activeScenarioId:", scenarioId);
            return { activeScenarioId: scenarioId };
        });
      },
      setActiveExecutionId: (executionId) => {
        
        set(() => {
            console.log("[setActiveExecutionId] Updated activeScenarioId:", executionId);
            return { activeExecutionId: executionId };
        });
      },
      // setWebhookDecisionPending: (isPending, nodeId) => set(() => ({
      //   webhookDecision: { isPending: isPending, nodeId: nodeId, showPrompt: isPending },
      // })),      
      // setWebhookUserDecision: (decision) => set((state) => ({
      //   webhookDecision: { ...state.webhookDecision, isPending: false, decision: decision },
      // })),

      setWebhookUserDecision: (decision, nodeId) => set(state => {
        // Update the state to reflect the user's decision
        const execution = state.scenarios[state.activeScenarioId]?.executions[state.executionId];
        if (execution && execution[nodeId]) {
          execution[nodeId].webhookEventStatus.userDecision = decision;
          // Additional logic to handle the decision, if necessary
        }
      }),
      
      setWebhookDecisionPending: (isPending, nodeId) => set(state => {
        // Update the state to reflect whether a decision is pending
        const execution = state.scenarios[state.activeScenarioId]?.executions[state.executionId];
        if (execution && execution[nodeId]) {
          execution[nodeId].webhookEventStatus.isPending = isPending;
        }
      }),

      
      setShowDecisionPrompt: (nodeId, show) => set(() => ({
        decisionPrompt: { nodeId: nodeId, show: show },
      })),

      setIsLoadingNode: (nodeId, isLoading) => {
      set((state) => ({

        nodeLoadingStates: {
          ...state.nodeLoadingStates,
          [nodeId]: isLoading,
        },
      }))
      console.log("[setIsLoadingNode] Called with:", { nodeId, isLoading })

    },
      setNodeContentMap: (contentMap) => {
        set({ nodeContentMap: contentMap });
      },

      setToastPosition: (position) => set(state => ({ toastPosition: position })),

      setNodes: (newStateOrUpdater) => {
        set((prevState) => {
            const currentScenario = prevState.scenarios[prevState.activeScenarioId];
            if (!currentScenario || !currentScenario.diagramData) {
                console.error(`[setNodes] Data inconsistency. Please check scenario data for ID: ${prevState.activeScenarioId}`);
                return prevState; // Return the existing state unchanged
            }

            let updatedNodes;
            if (typeof newStateOrUpdater === 'function') {
                updatedNodes = newStateOrUpdater(currentScenario.diagramData.nodes);
            } else {
                updatedNodes = newStateOrUpdater;
            }

            const updatedScenario = {
                ...currentScenario,
                diagramData: {
                    ...currentScenario.diagramData,
                    nodes: updatedNodes
                }
            };

            return {
                ...prevState,
                scenarios: {
                    ...prevState.scenarios,
                    [prevState.activeScenarioId]: updatedScenario
                }
            };
        });
      },

      setEdges: (newStateOrUpdater) => {
        set((prevState) => {
            const currentScenario = prevState.scenarios[prevState.activeScenarioId];
            if (!currentScenario || !currentScenario.diagramData) {
                console.error(`[setEdges] Data inconsistency. Please check scenario data for ID: ${prevState.activeScenarioId}`);
                return prevState; // Return the existing state unchanged
            }

            let updatedEdges;
            if (typeof newStateOrUpdater === 'function') {
                updatedEdges = newStateOrUpdater(currentScenario.diagramData.edges);
            } else {
                updatedEdges = newStateOrUpdater;
            }

            const updatedScenario = {
                ...currentScenario,
                diagramData: {
                    ...currentScenario.diagramData,
                    edges: updatedEdges
                }
            };

            return {
                ...prevState,
                scenarios: {
                    ...prevState.scenarios,
                    [prevState.activeScenarioId]: updatedScenario
                }
            };
        });
      },
        
      // setNodeConnections: (newConnections) => set({ nodeConnections: newConnections }),
      toggleExecuteFlowScenario: () => set((state) => ({ shouldExecuteFlowScenario: !state.shouldExecuteFlowScenario })),
      setExecutionState: (newState) => set((state) => ({ executionState: newState })),


      addScenario: (scenarioId, scenario) => {
        // Log the action initiation with its parameters
        console.log("[addScenario] Called with:", { scenarioId, scenario });
        
        if (!scenarioId) {
          console.error("[addScenario] Attempt to add scenario with empty ID");
          return;
        }
      
        set((state) => {
          const newScenario = {
            ...scenario, 
            version: 0, // Initialize version
            executions: {}
          };
      
          const newState = {
            scenarios: {
              ...state.scenarios,
              [scenarioId]: newScenario
            }
          };
    
          // Log the updated state (or a part of it)
          console.log("[addScenario] Updated scenarios:", newState.scenarios);
          
          return newState;
      });

        // // Check if the number of scenarios exceeds 3
        // const { scenarios } = get();
        // if (Object.keys(scenarios).length > 3) {
        //   evictOldScenario();
        // }
      
    },

    saveScenarioName: (scenarioId, newName) => {
      if (!scenarioId) {
          console.error('[saveScenarioName] Scenario ID is missing or incorrect. Cannot save scenario name.');
          return;
      }

      set((state) => {
          const updatedScenarios = {
              ...state.scenarios,
              [scenarioId]: {
                  ...state.scenarios[scenarioId],
                  name: newName
              }
          };
          return { scenarios: updatedScenarios };
      });
    },
        
    saveScenario: (scenarioId, diagramData) => {

      if (!scenarioId) {
          console.error('[saveScenario] Scenario ID is missing or incorrect. Cannot save scenario.');
          return;
      }

      set((state) => {
          let version = state.scenarios[scenarioId]?.version ?? 0;
          version += 1;
          
          const updatedScenarios = {
              ...state.scenarios,
              [scenarioId]: {
                  ...state.scenarios[scenarioId],
                  diagramData,
                  version
              }
          };
          return { scenarios: updatedScenarios };
      });
    },

    loadScenario: (scenarioId, executionId = null) => {
      const { scenarios, setActiveScenarioId, setActiveExecutionId } = get();
  
      setActiveScenarioId(scenarioId);
      setActiveExecutionId(executionId);

      
    
      if (executionId) {
        const selectedExecutionData = scenarios[scenarioId]?.executions?.[executionId];
        if (selectedExecutionData) {
          const updatedNodes = scenarios[scenarioId].diagramData.nodes.map(node => {
            const executionNodeData = selectedExecutionData[node.id];
            if (executionNodeData) {
              return { ...node, data: { ...node.data, nodeContent: executionNodeData.nodeContent }};
            }
            return node;
          });
  
          // Copy the scenarios state, then modify it
          const updatedScenarios = { ...scenarios };
          updatedScenarios[scenarioId].diagramData.nodes = updatedNodes;
  
          // Update the Zustand state
          set({ scenarios: updatedScenarios });
  
          console.log(`Loaded node content for execution ID: ${executionId}`);
        } else {
          console.warn(`Execution data for ID: ${executionId} not found.`);
        }
      };

      const selectedScenario = scenarios[scenarioId];

      if (!selectedScenario) {
        console.error(`Scenario with ID: ${scenarioId} not found.`);
        return false; // Exit early
      }
  
      // Check if nodeContent or formState is missing or undefined
      if (selectedScenario && (!selectedScenario.nodeContent || !selectedScenario.formState)) {
         loadScenarioAsync(scenarioId);  // Assume this function fetches the missing data and updates the Zustand store
      }
      return true;
    },
    
    deleteScenario: (scenarioId) => {
      const { scenarios } = get();
      console.log("Current Scenarios:", scenarios);
      console.log("Deleting scenario with ID:", scenarioId);
      const updatedScenarios = { ...scenarios };
      delete updatedScenarios[scenarioId];
      set({ scenarios: updatedScenarios });
      console.log(`Deleted scenario ${scenarioId} from local state`);
    },
    
    
    deleteExecution: (scenarioId, executionId) => {
      const { scenarios } = get();
      const updatedScenarios = { ...scenarios };
      if (updatedScenarios[scenarioId]?.executions) {
        delete updatedScenarios[scenarioId].executions[executionId];
        set({ scenarios: updatedScenarios });
        console.log(`Deleted execution ${executionId} from local state`);
      }
    },
      
    setNodeConnections: (newConnections) => {
      console.log("[setNodeConnections] Called with:", newConnections);

      set((state) => ({
          ...state,
          nodeConnections: newConnections,
      }));
    },  

    addNodeConnection: (nodeId, connection) => {
      set((state) => ({
          ...state,
          nodeConnections: {
              ...state.nodeConnections,
              [nodeId]: connection
          }
      }));
    },

    saveExecution: (newExecutionId) => {
      const { activeScenarioId } = get();

      set({ executionId: newExecutionId });

      console.log("[saveExecution] Attempting to save execution:", newExecutionId);
  
      console.log("[saveExecution] Current Execution ID:", newExecutionId);
      console.log("[saveExecution] Active Scenario ID:", activeScenarioId);
    
      if (!activeScenarioId) {
        console.error('[saveExecution] No active scenario. Cannot save execution.');
        return;
      }
    
      set((state) => {
        const currentScenario = state.scenarios[activeScenarioId];
    
        if (!currentScenario) {
          console.error(`[saveExecution] Scenario with ID ${activeScenarioId} not found. Cannot save execution.`);
          return;
        }
    
        console.log("[saveExecution] Current Scenario:", currentScenario);
    
        // Initialize an empty object to hold the execution data for each node
        const nodeExecutionData = {};
    
        // Loop through each node in the diagramData
        currentScenario.diagramData.nodes.forEach(node => {
          nodeExecutionData[node.id] = {
            nodeId: node.id,
            timestamp: new Date().toISOString(), // You can modify this if needed
            nodeContent: node.data?.nodeContent || '', // Safely fetching nodeContent
            nodeType: node.type,
            responseData: {}
          };
        });
    
        // Prepare the final execution data structure
        const executionData = {
          [newExecutionId]: nodeExecutionData
        };
    
        console.log("[saveExecution] Execution Data:", executionData);
    
        // Incorporate the prepared executionData into the scenario's executions
        const updatedExecutions = {
          ...currentScenario.executions,
          ...executionData
        };
    
        const updatedScenario = {
          ...currentScenario,
          executions: updatedExecutions
        };
        console.log("[saveExecution] Updated Scenario:", updatedScenario);
    
        return { scenarios: { ...state.scenarios, [activeScenarioId]: updatedScenario } };
      });
    },
    
    updateNodeContent: (executionId, nodeId, updatedContent) => {
      const activeScenarioId = get().activeScenarioId;

      if (!activeScenarioId) {
        console.error('[updateNodeContent] No active scenario. Cannot update node content.');
        return;
      }

      set((state) => {
        const currentScenario = state.scenarios[activeScenarioId];

        if (!currentScenario) {
          console.error(`[updateNodeContent] Scenario with ID ${activeScenarioId} not found. Cannot update node content.`);
          return;
        }

        const currentNodeExecutionData = currentScenario.executions[executionId][nodeId];
        if (!currentNodeExecutionData) {
          console.error(`[updateNodeContent] Node execution data for ID ${nodeId} not found. Cannot update node content.`);
          return;
        }

        // Set the nodeContent for the specific node (no appending here)
        return {
          scenarios: {
            ...state.scenarios,
            [activeScenarioId]: {
              ...currentScenario,
              executions: {
                ...currentScenario.executions,
                [executionId]: {
                  ...currentScenario.executions[executionId],
                  [nodeId]: {
                    ...currentNodeExecutionData,
                    nodeContent: updatedContent // set updated content directly
                  }
                }
              }
            }
          }
        };
      });
    },

    persistScenario: (scenarioId, persist) => {
      console.log('[persistScenario] Persisting scenario state (in useAppStore):', scenarioId, persist);
      set((state) => {
          const updatedState = {
              scenarios: {
                  ...state.scenarios,
                  [scenarioId]: { ...state.scenarios[scenarioId], persisted: persist },
              },
          };
          console.log("[persistScenario] Updated state for scenarioId:", updatedState.scenarios[scenarioId]);
          return updatedState;
      });
  },

    
    saveDiagramData: (scenarioId, diagramData) => {
        console.log('[saveDiagramData] Saving diagram data for scenario (in useAppStore):', scenarioId, diagramData);
        set((state) => {
          const updatedState = {
            scenarios: {
              ...state.scenarios,
              [scenarioId]: { ...state.scenarios[scenarioId], diagramData: { ...diagramData } },
            },
          };
          console.log("[saveDiagramData] Updated state for scenarioId:", updatedState.scenarios[scenarioId]);
          return updatedState;
        });
    },

    saveNodeFormData: (scenarioId, nodeId, formData) => {
        console.log("[saveNodeFormData] tis Called with:", { scenarioId, nodeId, formData });

        // Checking for potential issues
        if (!scenarioId || !nodeId) {
            console.error("[saveNodeFormData] Scenario ID or Node ID is missing. Cannot save node form data.");
            return;
        }

        set((state) => {
            const scenario = state.scenarios[scenarioId];
            
            if (!scenario) {
                console.error(`[saveNodeFormData] Scenario with ID ${scenarioId} not found.`);
                return;
            }

            const nodes = scenario.diagramData.nodes.map((node) =>
                node.id === nodeId ? { ...node, formData } : node
            );

            const updatedScenarios = {
                ...state.scenarios,
                [scenarioId]: { ...scenario, diagramData: { ...scenario.diagramData, nodes } },
            };

            console.log("[saveNodeFormData] Updated scenarios:", nodes, scenarioId);
            return { scenarios: updatedScenarios };
        });
    },

    saveNodeEventData: (scenarioId, nodeId, eventData) => {
      console.log("[saveNodeEventData] Called with:", { scenarioId, nodeId, eventData });

      // Checking for potential issues
      if (!scenarioId || !nodeId) {
          console.error("[saveNodeEventData] Scenario ID or Node ID is missing. Cannot save node form data.");
          return;
      }

      set((state) => {
        const scenario = state.scenarios[scenarioId];
        if (!scenario) {
          console.error(`[saveNodeEventData] Scenario with ID ${scenarioId} not found.`);
          return;
        }
    
        // Update the specific node with new eventData
        const updatedNodes = scenario.diagramData.nodes.map((node) =>
          node.id === nodeId ? { ...node, eventData: { ...node.eventData, ...eventData } } : node
        );
    
        return {
          scenarios: {
            ...state.scenarios,
            [scenarioId]: {
              ...scenario,
              diagramData: {
                ...scenario.diagramData,
                nodes: updatedNodes,
              },
            },
          },
        };
      });
    },


    // Assuming this function is updated to accept a scenarioId as well
    updateNodeResponseData: (scenarioId, executionId, nodeId, statusUpdate) => {
      set((state) => {
        console.log("[updateNodeResponseData] Called with:", { scenarioId, executionId, nodeId, statusUpdate });
        const scenario = state.scenarios[scenarioId];
        if (!scenario || !scenario.executions || !scenario.executions[executionId]) {
          console.error(`[updateNodeResponseData] Execution with ID ${executionId} not found in scenario ${scenarioId}.`);
          return;
        }
    
        const node = scenario.executions[executionId][nodeId];
        if (!node) {
          console.error(`[updateNodeResponseData] Node with ID ${nodeId} not found in execution ${executionId}.`);
          return;
        }
    
       
    
        // Wrap the status update in a Response object
        const wrappedStatusUpdate = {
          timestamp: new Date().toISOString(),
          data: {
            ...statusUpdate,
          },
        };
    
        // Append new status event updates without overwriting previous ones
        const updateExecutionResponseData = {
          ...node.responseData,
          eventUpdates: [
            ...(node.responseData.eventUpdates || []), // Ensure there's a default array to append to
            wrappedStatusUpdate,
          ],
        };
    
        // Using a more immutable approach to update the state
        return {
          scenarios: {
            ...state.scenarios,
            [scenarioId]: {
              ...scenario,
              executions: {
                ...scenario.executions,
                [executionId]: {
                  ...scenario.executions[executionId],
                  [nodeId]: {
                    ...node,
                    responseData: updateExecutionResponseData,
                  },
                },
              },
            },
          },
        };
      });
    },
    


    updateExecutionSigningJob: (scenarioId, executionId, nodeId, signingJob) => {
      set((state) => {
        const scenario = state.scenarios[scenarioId];
        if (!scenario || !scenario.executions || !scenario.executions[executionId]) {
          console.error(`[updateChainTxExecutionSigning] Execution with ID ${executionId} not found in scenario ${scenarioId}.`);
          return;
        }
  
        const node = scenario.executions[executionId][nodeId];
        if (!node) {
          console.error(`[updateChainTxExecutionSigning] Node with ID ${nodeId} not found in execution ${executionId}.`);
          return;
        }
  
        // Update the state with the new signing job details
        return {
          scenarios: {
            ...state.scenarios,
            [scenarioId]: {
              ...scenario,
              executions: {
                ...scenario.executions,
                [executionId]: {
                  ...scenario.executions[executionId],
                  [nodeId]: {
                    ...node,
                    signingJob: signingJob,
                  },
                },
              },
            },
          },
        };
      });
    },

    
    updateNodeWebhookEventStatus: (scenarioId, executionId, nodeId, { hasPreviousEvents, userDecision }) => {
      set((state) => {
        console.log("[updateNodeWebhookEventStatus] Called with:", { scenarioId, executionId, nodeId, hasPreviousEvents, userDecision });
        const scenario = state.scenarios[scenarioId];
        if (!scenario || !scenario.executions || !scenario.executions[executionId]) {
          console.error(`[updateNodeWebhookEventStatus] Execution with ID ${executionId} not found in scenario ${scenarioId}.`);
          return;
        }
    
        const node = scenario.executions[executionId][nodeId];
        if (!node) {
          console.error(`[updateNodeWebhookEventStatus] Node with ID ${nodeId} not found in execution ${executionId}.`);
          return;
        }
    
        // Update the node with the new webhook event status
        const updateWebhookEventStatus = {
          ...node.webhookEventStatus, // Ensure existing status is preserved
          hasPreviousEvents: hasPreviousEvents,
          userDecision: userDecision,
        };
    
        // Using a more immutable approach to update the state
        return {
          scenarios: {
            ...state.scenarios,
            [scenarioId]: {
              ...scenario,
              executions: {
                ...scenario.executions,
                [executionId]: {
                  ...scenario.executions[executionId],
                  [nodeId]: {
                    ...node,
                    webhookEventStatus: updateWebhookEventStatus,
                  },
                },
              },
            },
          },
        };
      });
    },
    
    

    saveTriggerNodeToast: (scenarioId, nodeId, shouldTrigger) => {
      console.log("[triggerNodeToast] Called with:", { scenarioId, nodeId, shouldTrigger });
  
      // Checking for potential issues
      if (!scenarioId || !nodeId) {
          console.error("[triggerNodeToast] Scenario ID or Node ID is missing. Cannot trigger node toast.");
          return;
      }
  
      set((state) => {
          const scenario = state.scenarios[scenarioId];
          
          if (!scenario) {
              console.error(`[triggerNodeToast] Scenario with ID ${scenarioId} not found.`);
              return;
          }
  
          const nodes = scenario.diagramData.nodes.map((node) =>
              node.id === nodeId ? { ...node, data: { ...node.data, triggerToast: shouldTrigger } } : node
          );
  
          const updatedScenarios = {
              ...state.scenarios,
              [scenarioId]: { ...scenario, diagramData: { ...scenario.diagramData, nodes } },
          };
  
          console.log("[triggerNodeToast] Updated scenarios:", updatedScenarios, scenarioId);
          return { scenarios: updatedScenarios };
      });
  },
  

    saveActionDataForNode: (scenarioId, nodeId, newActionData) => {
      console.log("[saveActionDataForNode] Called with:", { scenarioId, nodeId, newActionData });
      set((state) => {
          const scenario = state.scenarios[scenarioId];
          if (!scenario) return; // return if no scenario found
          
          const nodes = scenario.diagramData.nodes.map((node) => 
              node.id === nodeId 
                  ? { ...node, formData: { ...node.formData, actionData: newActionData } } 
                  : node
          );
          
          const updatedScenarios = {
              ...state.scenarios,
              [scenarioId]: { ...scenario, diagramData: { ...scenario.diagramData, nodes } },
          };
          return { scenarios: updatedScenarios };
      });
  },  

    saveSignedExtrinsic: (scenarioId, nodeId, signedExtrinsic) => {
      console.log("[saveSignedExtrinsic] Called with:", { scenarioId, nodeId, signedExtrinsic });
  
      // Checking for potential issues
      if (!scenarioId || !nodeId || !signedExtrinsic) {
          console.error("[saveSignedExtrinsic] Scenario ID, Node ID or signedExtrinsic is missing. Cannot save the signed extrinsic.");
          return;
      }
  
      set((state) => {
        const scenarios = { ...state.scenarios };
        const scenario = scenarios[scenarioId];

          if (!scenario) {
              console.error(`[saveSignedExtrinsic] Scenario with ID ${scenarioId} not found.`);
              return;
          }
  
          const nodes = scenario.diagramData.nodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                extrinsics: { 
                  signedExtrinsic, 
                  isUsed: false 
                }
              };
            }
            return node;
          });
  
          const updatedScenarios = {
              ...scenarios,
              [scenarioId]: { ...scenario, diagramData: { ...scenario.diagramData, nodes } },
          };
  
          console.log("[saveSignedExtrinsic] Updated scenarios with signed extrinsic:", updatedScenarios);
          return { scenarios: updatedScenarios };
      });
  },

  markExtrinsicAsUsed: (scenarioId, nodeId) => {
    set((state) => {
      const scenarios = { ...state.scenarios };
      const scenario = scenarios[scenarioId];
      
      if (!scenario) {
        console.error(`[markExtrinsicAsUsed] Scenario with ID ${scenarioId} not found.`);
        return;
      }
      
      const nodes = scenario.diagramData.nodes.map((node) => {
        if (node.id === nodeId && node.extrinsics?.signedExtrinsic) {
          return {
            ...node,
            extrinsics: { 
              ...node.extrinsics, 
              isUsed: true 
            }
          };
        }
        return node;
      });
  
      return { scenarios: { ...scenarios, [scenarioId]: { ...scenario, diagramData: { ...scenario.diagramData, nodes } } } };
    });
  },

  
    addNodeToScenario: (scenarioId, newNode) => {
      console.log("[addNodeToScenario] Called with:", { scenarioId, newNode });

    //   if (!state.scenarios) {
    //   console.error("[addNodeToScenario] Invalid state or scenario ID:", scenarioId);
    //   return;
    // }

      if (!scenarioId) {
          console.error("[addNodeToScenario] Attempt to add node with empty scenario ID");
          return;
      }

      set((state) => {
          const currentScenario = state.scenarios[scenarioId];

          if (!currentScenario) {
              console.error("[addNodeToScenario] No scenario found for given ID:", scenarioId);
              return; // Handle error if needed
          }

          // Add the new node to the existing nodes for this scenario
          const updatedNodes = currentScenario.diagramData.nodes.concat(newNode);

          const updatedScenarios = {
              ...state.scenarios,
              [scenarioId]: {
                  ...currentScenario,
                  diagramData: {
                      ...currentScenario.diagramData,
                      nodes: updatedNodes,
                  },
              },
          };

          console.log("[addNodeToScenario] Updated scenarios:", updatedScenarios);

          // Return the updated state
          return { scenarios: updatedScenarios };
      });
    },

    addEdgeToScenario: (scenarioId, edge) => {
      set((state) => {
          const currentScenario = state.scenarios[scenarioId];
          if (!currentScenario || !currentScenario.diagramData) {
              console.error(`[addEdgeToScenario] Data inconsistency. Please check scenario data for ID: ${scenarioId}`);
              return;
          }

          const updatedEdges = [...currentScenario.diagramData.edges, edge];

          const updatedScenarios = {
              ...state.scenarios,
              [scenarioId]: {
                  ...currentScenario,
                  diagramData: {
                      ...currentScenario.diagramData,
                      edges: updatedEdges,
                  },
              },
          };

          // Return the updated state
          return { scenarios: updatedScenarios };
      });
    },
    

    deleteNodeFromScenario: (scenarioId, nodeIdsToDelete) => {
      console.log("[deleteNodeFromScenario] Called with:", { scenarioId, nodeIdsToDelete });
  
      if (!scenarioId || !nodeIdsToDelete || nodeIdsToDelete.length === 0) {
          console.error('[deleteNodeFromScenario] Invalid parameters provided. Action aborted.');
          return;
      }
  
      set((state) => {
          const currentScenario = state.scenarios[scenarioId];
          if (!currentScenario) {
              console.error(`[deleteNodeFromScenario] Scenario with ID ${scenarioId} not found. Action aborted.`);
              return; 
          }
  
          // Filter out the nodes that are not in the delete list
          const updatedNodes = currentScenario.diagramData.nodes.filter(
              node => !nodeIdsToDelete.includes(node.id)
          );
  
          // Filter out the edges connected to the deleted nodes
          const updatedEdges = currentScenario.diagramData.edges.filter(
              edge => !nodeIdsToDelete.includes(edge.source) && !nodeIdsToDelete.includes(edge.target)
          );
  
          const updatedScenarios = {
              ...state.scenarios,
              [scenarioId]: {
                  ...currentScenario,
                  diagramData: {
                      ...currentScenario.diagramData,
                      nodes: updatedNodes,
                      edges: updatedEdges,
                  },
                  // Clear out the selectedNodeId if it was deleted
                  selectedNodeId: nodeIdsToDelete.includes(currentScenario.selectedNodeId) ? null : currentScenario.selectedNodeId
              },
          };
          
          console.log("[deleteNodeFromScenario] Updated scenarios:", updatedScenarios);
          return { scenarios: updatedScenarios };
      });
  },
  

    deleteEdgeFromScenario: (scenarioId, edgeId) => {
      console.log("[deleteEdgeFromScenario] Called with:", { scenarioId, edgeId });

      if (!scenarioId || !edgeId) {
          console.error("[deleteEdgeFromScenario] Scenario ID or Edge ID is missing. Cannot proceed.");
          return;
      }

      set((state) => {
          const currentScenario = state.scenarios[scenarioId];
          if (!currentScenario || !currentScenario.diagramData || !currentScenario.diagramData.edges) {
              console.error("[deleteEdgeFromScenario] Data inconsistency detected. Please check scenario data for ID:", scenarioId);
              return; // Handle error if needed
          }

          // Filter out the deleted edge
          const updatedEdges = currentScenario.diagramData.edges.filter(edge => edge.id !== edgeId);

          const updatedScenarios = {
              ...state.scenarios,
              [scenarioId]: {
                  ...currentScenario,
                  diagramData: {
                      ...currentScenario.diagramData,
                      edges: updatedEdges,
                  },
                  // Clear out the selectedEdgeId if it was deleted
                  selectedEdgeId: edgeId === currentScenario.selectedEdgeId ? null : currentScenario.selectedEdgeId,
              },
          };
          
          console.log("[deleteEdgeFromScenario] Updated scenarios:", updatedScenarios);
          return {         
            scenarios: updatedScenarios,
            selectedEdgeId: null 
          };
      });
    },

    updateNodePositionInScenario: (scenarioId, nodeId, newPosition) => {
      console.log("[updateNodePositionInScenario] Called with:", { scenarioId, nodeId, newPosition });
      
      set((state) => {
          const currentScenario = state.scenarios[scenarioId];
          if (!currentScenario) {
              console.error("[updateNodePositionInScenario] No scenario found with ID:", scenarioId);
              return;
          }
          
          // Find the node with the given nodeId and update its position
          const updatedNodes = currentScenario.diagramData.nodes.map(node => 
              node.id === nodeId ? { ...node, position: newPosition } : node
          );
          
          const updatedScenario = {
              ...currentScenario,
              diagramData: {
                  ...currentScenario.diagramData,
                  nodes: updatedNodes,
              },
          };

          console.log("[updateNodePositionInScenario] Updated scenario:", updatedScenario);
          
          // Return the updated state
          return {
              scenarios: {
                  ...state.scenarios,
                  [scenarioId]: updatedScenario,
              },
          };
      });
    },

    setSelectedNodeInScenario: (scenarioId, nodeId) => {
        console.log("[setSelectedNodeInScenario] Called with:", { scenarioId, nodeId });

        if (!scenarioId) {
            console.error("[setSelectedNodeInScenario] scenarioId is missing. Cannot set selected node.");
            return;
        }
        
        // The actual implementation would depend on how you handle the selection.
        // For this example, I'm assuming a 'selectedNodeId' field inside the scenario object.
        set((state) => {
            const currentScenario = state.scenarios[scenarioId];
            if (!currentScenario) {
                console.error("[setSelectedNodeInScenario] Scenario not found in state for scenarioId:", scenarioId);
                return; // Handle error if needed
            }

            return {
                scenarios: {
                    ...state.scenarios,
                    [scenarioId]: {
                        ...currentScenario,
                        selectedNodeId: nodeId,
                    },
                },
            };
        });
    },

    setSelectedEdgeInScenario: (scenarioId, edgeId) => {
        console.log("[setSelectedEdgeInScenario] Called with:", { scenarioId, edgeId });

        if (!scenarioId) {
            console.error("[setSelectedEdgeInScenario] scenarioId is missing. Cannot set selected edge.");
            return;
        }
        
        // The actual implementation would depend on how you handle the selection.
        // For this example, I'm assuming a 'selectedNodeId' field inside the scenario object.
        set((state) => {
            const currentScenario = state.scenarios[scenarioId];
            if (!currentScenario) {
                console.error("[setSelectedNodeInScenario] Scenario not found in state for scenarioId:", scenarioId);
                return; // Handle error if needed
            }

            return {
                scenarios: {
                    ...state.scenarios,
                    [scenarioId]: {
                        ...currentScenario,
                        selectedEdgeId: edgeId,
                    },
                },
            };
        });
    },

    updateNodesInScenario: (scenarioId, updatedNodes) => {
        console.log("[updateNodesInScenario] Called with:", { scenarioId, updatedNodes });

        if (!scenarioId) {
            console.error('[updateNodesInScenario] scenarioId is null, cannot update nodes.');
            return;
        }

        set((state) => {
            const currentScenario = state.scenarios[scenarioId];
            if (!currentScenario) {
                console.error("[updateNodesInScenario] Scenario not found in state for scenarioId:", scenarioId);
                return; // Handle error if needed
            }
        
            return {
                scenarios: {
                    ...state.scenarios,
                    [scenarioId]: {
                        ...currentScenario,
                        diagramData: {
                            ...currentScenario.diagramData,
                            nodes: updatedNodes,
                        },
                    },
                },
            };
        });
    },

    updateEdgesInScenario: (scenarioId, updatedEdges) => {
      console.log("[updateEdgesInScenario] Called with:", { scenarioId, updatedEdges });

      set((state) => {
          const currentScenario = state.scenarios[scenarioId];
          if (!currentScenario) {
              console.error("[updateEdgesInScenario] Scenario not found for ID:", scenarioId);
              return; // Handle error if needed
          }

          const updatedScenarios = {
              ...state.scenarios,
              [scenarioId]: {
                  ...currentScenario,
                  diagramData: {
                      ...currentScenario.diagramData,
                      edges: updatedEdges,
                  },
              },
          };
          
          console.log("[updateEdgesInScenario] Updated scenarios:", updatedScenarios);
          return { scenarios: updatedScenarios };
      });

    },

    saveChainAddress: (newAddress) => {
      set((state) => {
          // Check if address already exists
          if (!state.chainAddresses.includes(newAddress)) {
              const updatedAddresses = [...state.chainAddresses, newAddress];
              
              // Save to local storage
              // localStorage.setItem('chainAddresses', JSON.stringify(updatedAddresses));
              
              // Update state
              return { chainAddresses: updatedAddresses };
          }
      });
    },

  saveHrmpChannels: (newChannels) => {
    set((state) => {
      console.log("Existing channels:", state.hrmpChannels);
      console.log("saveHrmpChannels Saving channels to store:", newChannels);
      return {
        ...state,
        hrmpChannels: { ...state.hrmpChannels, ...newChannels }
      }
    });
  },
  
  // Action to update the edges with the correct style
  updateEdgeStyleForNode: (nodeId, style) => {

    const activeScenarioId = get().activeScenarioId;

    console.log("[updateEdgeStyleForNode] Called with:", { nodeId, style, activeScenarioId });


  
    set((state) => {
      const currentScenario = state.scenarios[activeScenarioId];
      
      if (!currentScenario || !currentScenario.diagramData || !Array.isArray(currentScenario.diagramData.edges)) {
        console.error(`[updateEdgeStyleForNode] Data inconsistency. Please check scenario data for ID: ${activeScenarioId}`);
        return;
      }
  
      // Update the edges associated with the given nodeId and apply the style
      const updatedEdges = currentScenario.diagramData.edges.map(edge => {
        if (edge.source === nodeId || edge.target === nodeId) {
          return {
            ...edge,
            ...EDGE_STYLES[style],
          };
        }
        return edge;
      });

      console.log("[updateEdgeStyleForNode] Updated edges:", updatedEdges);
  
      const updatedScenario = {
        ...currentScenario,
        diagramData: {
          ...currentScenario.diagramData,
          edges: updatedEdges,
        },
      };
  
      console.log("[updateEdgeStyleForNode] Updated edges for scenario:", activeScenarioId, updatedScenario);
  
      // Return the updated state
      return { scenarios: { ...state.scenarios, [activeScenarioId]: updatedScenario } };
    });
  },
  
  setSelectedWebhookInNode: (scenarioId, nodeId, webhookName, webhookUuid) => {
    if (!scenarioId || !nodeId) {
      console.error("[setSelectedWebhookInNode] Missing scenarioId or nodeId.");
      return;
    }
  
    set((state) => {
      const currentScenario = state.scenarios[scenarioId];
      if (!currentScenario) {
        console.error("[setSelectedWebhookInNode] Scenario not found for scenarioId:", scenarioId);
        return;
      }
  
      const updatedNodes = currentScenario.diagramData.nodes.map((node) =>
        node.id === nodeId ? { ...node, selectedWebhook: webhookName, uuid: webhookUuid } : node
      );
  
      return {
        scenarios: {
          ...state.scenarios,
          [scenarioId]: {
            ...currentScenario,
            diagramData: {
              ...currentScenario.diagramData,
              nodes: updatedNodes,
            },
          },
        },
      };
    });
  },

  saveWebhook: (webhook) => {
    set((state) => {
      const existingWebhook = state.webhooks.find(w => w.uuid === webhook.uuid);
      if (existingWebhook) {
        // Update existing webhook
        return {
          webhooks: state.webhooks.map(w => w.uuid === webhook.uuid ? webhook : w)
        };
      } else {
        // Add new webhook
        return { webhooks: [...state.webhooks, webhook] };
      }
    });
  },

  clearSignedExtrinsic: (scenarioId, nodeId) => {
    set((state) => {
      const scenarios = { ...state.scenarios };
      const scenario = scenarios[scenarioId];
  
      if (!scenario) {
        console.error(`[clearUsedSignedExtrinsic] Scenario with ID ${scenarioId} not found.`);
        return state; // Early return with unchanged state if the scenario is not found.
      }
  
      // Map through the nodes, removing signedExtrinsic for those where isUsed === true
      const nodes = scenario.diagramData.nodes.map(node => {
        console.log(`[clearUsedSignedExtrinsic] Clearing signedExtrinsic for node ${nodeId} as it's marked as used.`);

        if (node.id === nodeId && node.extrinsics?.isUsed) {
          // If isUsed is true, we remove the signedExtrinsic
          const { signedExtrinsic, ...restExtrinsics } = node.extrinsics;
          console.log(`[clearUsedSignedExtrinsic] Clearing signedExtrinsic for node ${node.id} as it's marked as used.`);
          return { ...node, extrinsics: { ...restExtrinsics, isUsed: null } }; // Optionally reset isUsed
        }
        return node; // Return the node unchanged if isUsed is not true
      });
  
      // Update the scenario with the modified list of nodes
      const updatedScenario = {
        ...scenario,
        diagramData: { ...scenario.diagramData, nodes }
      };
  
      return {
        ...state,
        scenarios: {
          ...scenarios,
          [scenarioId]: updatedScenario
        }
      };
    });
  },
  
  




  
  
  }
)
),
{
  name: 'orgs-app-storage',  // Unique name for the storage item
  storage: createJSONStorage(() => localStorage),
  onRehydrateStorage: (state) => {
    console.log('Hydrating state...');
    return (state, error) => {
      if (error) {
        console.error('An error occurred during hydration:', error);
      } else {
        console.log('State hydrated successfully.');
      }
    };
  }
}
),




);

window.store = useAppStore; // For zukeeper debugging, remove for production
export default useAppStore;