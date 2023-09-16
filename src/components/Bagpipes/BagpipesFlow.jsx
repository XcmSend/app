// @ts-nocheck
// Copyright 2019-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0
// @ts-nocheck

import React, { useState, useRef, useCallback , useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { Panel, ReactFlowProvider, MiniMap, Controls, Background,   BackgroundVariant, useNodesState, useEdgesState, addEdge, applyNodeChanges, applyEdgeChanges, Handle, Position, NodeToolbar, useStoreApi, useNodeId, EdgeLabelRenderer } from 'reactflow';
// import AuthService from '../../services/AuthService';
import { useExecuteScenario, useCopyPaste, useUndoRedo, useSaveDiagramState } from './hooks';
import useAppStore from '../../store/useAppStore';
import TextUpdaterNode from './TextupdaterNode';
import Sidebar from './Sidebar';
import FormGroupNode from './FormGroupNode';
import OpenAINode from './CustomNodes/OpenAINode';
import ChainNode from './CustomNodes/ChainNode/ChainNode';
import ActionNode from './CustomNodes/ActionNode';
import CustomEdge from './CustomEdges/CustomEdge';
import OpenAINodeForm from './Forms/OpenAINodeForm/OpenAINodeForm';
import { initialEdges, initialNodes } from './nodes.jsx';
import PlayButton from './PlayButton';

import './utils/getAllConnectedNodes';
import { v4 as uuidv4 } from 'uuid';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme';
import { node } from 'stylis';


import { onConnect, onEdgesChange, onNodesChange } from '../../store/reactflow/';
import useOnEdgesChange from '../../store/reactflow/useOnEdgesChange';
import Edges from './edges';

// import 'reactflow/dist/style.css';
// import './node.styles.scss';
// import '../../index.css';

const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${(props) => props.theme.bg};
`;
// Make the dark theme a bg-slate-900 style similar to Tailwind website
const ControlsStyled = styled(Controls)`
  button {
    background-color: ${(props) => props.theme.controlsBg};
    color: ${(props) => props.theme.controlsColor};
    border-bottom: 1px solid ${(props) => props.theme.controlsBorder};

    &:hover {
      background-color: ${(props) => props.theme.controlsBgHover};
    }

    path {
      fill: currentColor;
    }
  }
`;

const MIN_DISTANCE = 300;
let id = 0;
const proOptions = { hideAttribution: true };
const nodeTypes = { 
  textUpdater: TextUpdaterNode, 
  formGroup: FormGroupNode,
  openAi: OpenAINode,
  chain: ChainNode,
  action: ActionNode,
};

const edgeTypes = {
    custom: CustomEdge,
    // 'start-end': CustomEdgeStartEnd,
  };

const getId = (nodeType) => `${nodeType}_${uuidv4().substr(0, 6)}`;

const BagpipesFlow = () => {

  const reactFlowWrapper = useRef(null);

    const { scenarios, activeScenarioId, addScenario, setActiveScenarioId, saveScenario, saveDiagramData, addNodeToScenario, addEdgeToScenario, deleteNodeFromScenario, deleteEdgeFromScenario, updateNodePositionInScenario, updateNodesInScenario, setSelectedNodeInScenario, setSelectedEdgeInScenario, nodeConnections, setNodes, setEdges, setNodeConnections, tempEdge, setTempEdge, loading } = useAppStore(state => ({
      scenarios: state.scenarios,
      activeScenarioId: state.activeScenarioId,
      addScenario: state.addScenario,
      setActiveScenarioId: state.setActiveScenarioId,
      saveScenario: state.saveScenario,
      saveDiagramData: state.saveDiagramData,
      addNodeToScenario: state.addNodeToScenario,
      addEdgeToScenario: state.addEdgeToScenario,
      deleteNodeFromScenario: state.deleteNodeFromScenario,
      deleteEdgeFromScenario: state.deleteEdgeFromScenario,
      updateNodePositionInScenario: state.updateNodePositionInScenario,
      updateNodesInScenario: state.updateNodesInScenario,
      setSelectedNodeInScenario: state.setSelectedNodeInScenario,
      setSelectedEdgeInScenario: state.setSelectedEdgeInScenario,
      nodeConnections: state.nodeConnections,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      setNodeConnections: state.setNodeConnections,
      setTempEdge: state.setTempEdge,
      tempEdge: state.tempEdge,
      loading: state.loading,
    }));
    const store = useStoreApi();
    const currentScenarioNodes = scenarios[activeScenarioId]?.diagramData?.nodes || [];
    const currentScenarioEdges = scenarios[activeScenarioId]?.diagramData?.edges || [];


    const navigate = useNavigate(); // Using `useNavigate` hook from `react-router-dom`
    const [mode, setMode] = useState('light');
    const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();
    // console.log("takeSnapshot from useUndoRedo:", takeSnapshot);
    const theme = mode === 'light' ? lightTheme : darkTheme;

    const [modalNodeId, setModalNodeId] = useState(null);
    // const [nodeConnections, setNodeConnections] = useState({});
    // const [nodes, setNodes] = useNodesState([]);
    // const [edges, setEdges] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [inputVariablesByEdgeId, setInputVariablesByEdgeId] = useState({});
    const [maxNodeId, setMaxNodeId] = useState(0);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState(null);

    const { executeScenario, nodeContentMap, stopExecution } = useExecuteScenario(currentScenarioNodes, setNodes);



    // // Related to proximity connections 
    // const [tempEdges, setTempEdges] = useState([]);
  const combinedEdges = [...currentScenarioEdges, tempEdge].filter(Boolean);

    // const { cut, copy, paste, bufferedNodes } = useCopyPaste(); // causing paste to not work at all
    useSaveDiagramState(currentScenarioNodes, currentScenarioEdges);

    // console.log('before can copy', currentScenarioNodes);
    if (typeof currentScenarioNodes === 'function') {
      console.error("nodes is a function:", currentScenarioNodes);
      // currentScenarioNodes = [];
    }
    const canCopy = currentScenarioNodes.some(({ selected }) => selected);
    // const canPaste = bufferedNodes.length > 0;
      const toggleMode = () => {
        setMode((m) => (m === 'light' ? 'dark' : 'light'));
      };

      const saveState = useCallback(() => {
        const diagramData = {
          nodes: currentScenarioNodes,
          edges: currentScenarioEdges,
        };
    
        console.log("Saving State:", diagramData); 

        // Save the diagram data to local storage
        localStorage.setItem('diagramData', JSON.stringify(diagramData));
      }, [currentScenarioNodes, currentScenarioEdges]);



      // useEffect(() => {
      //     nodes.forEach(node => {
      //         const formData = getFormDataForNode(node);  // You'll need to implement getFormDataForNode
      //         saveNodeFormData(node.id, formData);
      //     });
      // }, [nodes]);
    
      useEffect(() => {
        
        // Load diagram data from local storage
        const storedDiagramData = localStorage.getItem('diagramData');
        console.log('stored diagram data', storedDiagramData)
        if (storedDiagramData) {
          const { nodes, edges } = JSON.parse(storedDiagramData);
    
          setNodes(nodes);
          setEdges(edges);
        }
      }, []);




      useEffect(() => {
        console.log("Active Scenario ID in Bagpipes:", activeScenarioId);
      }, [activeScenarioId]);

      useEffect(() => {
        // Check if there's an active scenario when the component mounts
        if (activeScenarioId === null) {
          console.log('No active scenario. Redirecting to Lab.');
          navigate('/lab'); // Redirect to Lab page
        }
      }, []); 
    

      useEffect(() => {
        setNodes(nodes =>
          nodes.map((node) => {
            if (node.type === 'openAi') {
              return {
                ...node,
                data: {
                  ...node.data,
                  nodeContent: nodeContentMap[node.id] || "",
                },
              };
            }
            return node;
          })
        );
      }, [nodeContentMap]);
      
      useEffect(() => {
        const maxIdInNodes = Math.max(...currentScenarioNodes.map(node => parseInt(node.id)), maxNodeId);
        if(maxIdInNodes > maxNodeId) {
          setMaxNodeId(maxIdInNodes);
        }
      }, [currentScenarioNodes]);
      
    
    
    // Load the scenario data when the component mounts
    useEffect(() => {
      if (activeScenarioId) {
          const currentScenario = scenarios[activeScenarioId];
          if (currentScenario && currentScenario.diagramData) {
            console.log('currentScenario.diagramData hook in Bagpipes', currentScenario.diagramData)
              // Set the nodes and edges from the current scenario
              const { nodes: newNodes, edges: newEdges } = currentScenario.diagramData;
              setNodes(newNodes);
              setEdges(newEdges);
          }
      }
  }, [activeScenarioId]);
  

    
    const getAllConnectedNodes = (nodeId, currentScenarioEdges, connectedNodes = []) => {
        const directConnections = currentScenarioEdges.filter(edge => edge.target === nodeId);
        
        directConnections.forEach(connection => {
          if (!connectedNodes.includes(connection.source)) {
            connectedNodes.push(connection.source);
            getAllConnectedNodes(connection.source, currentScenarioEdges, connectedNodes);
          }
        });
      
        return connectedNodes;
      };
    

  
  
          /**
     * Callback function that gets triggered when the nodes state changes.
     * @param changes {object} - Contains the changes made to the node state.
     */
          const onNodesChange = useCallback((changes) => {
            console.log("Active Scenario ID:", activeScenarioId);
            console.log("Changes received:", changes); // Add this line to log changes
          
            if (!Array.isArray(changes)) {
              console.error("Changes should be an array but received:", changes);
              return;
            }
          
            takeSnapshot();
       
            // Use the Zustand action instead
            setNodes((prevNodes) => {
            const updatedNodes = applyNodeChanges(changes, prevNodes);
            
              // Update the nodes in the current scenario
              updateNodesInScenario(activeScenarioId, updatedNodes);
          
              return updatedNodes;
            });
          }, [takeSnapshot, activeScenarioId]);

          
    
    const handleEdgesChange = onEdgesChange(setEdges, setInputVariablesByEdgeId, inputVariablesByEdgeId, activeScenarioId, addEdgeToScenario, scenarios, takeSnapshot);
    // const handleEdgesChange = useOnEdgesChange(appStore.setState, appStore.getState, setInputVariablesByEdgeId, inputVariablesByEdgeId, handleEdgesOperation, activeScenarioId, takeSnapshot);

    const handleConnect = (params) => {
      onConnect(currentScenarioEdges, nodeConnections, setEdges, setNodeConnections, activeScenarioId, addEdgeToScenario)(params);
    };
        
      /**
     * Function to get the closest edge to a node.
     * @param node {object} - The node to get the closest edge for.
     * @returns {object} - Returns an object containing the id, source, and target of the closest edge.
     */
    const getClosestEdge = useCallback((node) => {
      const { nodeInternals } = store.getState();
      const storeNodes = Array.from(nodeInternals.values());
  
      const closestNode = storeNodes.reduce(
        (res, n) => {
          if (n.id !== node.id) {
            const dx = n.positionAbsolute.x - node.positionAbsolute.x;
            const dy = n.positionAbsolute.y - node.positionAbsolute.y;
            // Adjust these factors to tweak the preference for horizontal vs. vertical
            const horizontalFactor = 0.5; // less than 1, to give preference to horizontal connections
            const verticalFactor = 1.5; // more than 1, to make vertical connections less likely
            const d = Math.sqrt((dx * dx * horizontalFactor) + (dy * dy * verticalFactor));
      
            if (d < res.distance && d < MIN_DISTANCE) {
              res.distance = d;
              res.node = n;
            }
          }
      
          return res;
        },
        {
          distance: Number.MAX_VALUE,
          node: null,
        }
      );

      if (!closestNode.node) {
        return null;
      }
      
  
      const closeNodeIsSource = closestNode.node.positionAbsolute.x < node.positionAbsolute.x;
  
      console.log("Closest node found:", closestNode.node);
      console.log("Resulting edge:", {
        id: `${node.id}-${closestNode.node.id}`,
        source: closeNodeIsSource ? closestNode.node.id : node.id,
        target: closeNodeIsSource ? node.id : closestNode.node.id,
      });
    
      return {
        id: `${node.id}-${closestNode.node.id}`,
        source: closeNodeIsSource ? closestNode.node.id : node.id,
        target: closeNodeIsSource ? node.id : closestNode.node.id,
      };
    }, []);
  
      /**
     * Function that is called when a node is dragged. It computes the closest edge to the dragged node.
     * @param _ {object} - Contains event related data.
     * @param node {object} - The node being dragged.
     */
      const onNodeDrag = useCallback(
        (_, node) => {
          console.log("Node being dragged:", node);
          const closeEdge = getClosestEdge(node);
          takeSnapshot();
      
          if (closeEdge && !currentScenarioEdges.some(e =>
              (e.source === closeEdge.source && e.target === closeEdge.target) ||
              (e.source === closeEdge.target && e.target === closeEdge.source)
            )) {
            // Add the temporary edge with 'temp' className
            closeEdge.className = 'temp';
            // setEdges(currentEdges => [...currentEdges, closeEdge]);
            setTempEdge(closeEdge);
            console.log("Added temp edge:", closeEdge);
          } 
      
          // Existing logic for updating node position in the scenario
          updateNodePositionInScenario(activeScenarioId, node.id, node.position);
          console.log("Updating node position:", activeScenarioId, node.id, node.position);
        },
        [getClosestEdge, currentScenarioEdges, takeSnapshot, updateNodePositionInScenario, activeScenarioId]
      );
      
      
      
      
  
      const onNodeDragStop = useCallback(
        (_, node) => {
          const closeEdge = getClosestEdge(node);
          takeSnapshot();
      
          setEdges(prevEdges => {
            // Remove any temp edges from the list
            const connectedEdges = prevEdges.filter(e => e.className !== 'temp');
      
            // If there's a close edge and it's not already connected, add it
            if (closeEdge && !connectedEdges.some(ne =>
                (ne.source === closeEdge.source && ne.target === closeEdge.target) ||
                (ne.source === closeEdge.target && ne.target === closeEdge.source)
              )) {
              const connectedEdge = { ...closeEdge, className: undefined }; // Remove the 'temp' className
              connectedEdges.push(connectedEdge);
              
              console.log("Connected edge added:", connectedEdge);
              // Call the action to add the edge to the current scenario
              addEdgeToScenario(activeScenarioId, connectedEdge);
            } 
            
            // Return the new edges list
            return connectedEdges;
          });
      
          // Always clear the temp edge after the drag stop
          setTempEdge(null);
      
        },
        [getClosestEdge, takeSnapshot, activeScenarioId, addEdgeToScenario]
      );
      
    
    

      /**
     * Function to prevent default behavior when something is being dragged over the drop area.
     * @param event {object} - The event data.
     */
    const onDragOver = useCallback((event) => {
        takeSnapshot();
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, [takeSnapshot]);

    /**
     * Function that handles when something is dropped into the react flow area. 
     * It adds a new node of the dropped type to the nodes state at the position of the drop event.
     * @param event {object} - The event data.
     */
        const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            takeSnapshot();
            // The type of the node is determined based on what was dragged and dropped.
            const nodeType = event.dataTransfer.getData('application/reactflow').toLowerCase();
    
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
        
            if (typeof type === 'undefined' || !type) {
            return;
            }
        
            const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
            });

        
            // Handle formGroup node
            if (type === 'formGroup') {
            // formGroup node data
            const data = {
                label: 'Form Group',
                image: './.svg',
                name: "Form Group Example",
                fields: [
                { label: "Field 1", type: "text" },
                { label: "Field 2", type: "number" },
                ]
            };
        
            // formGroup node creation
            const groupId = getId();
            const nodesToAdd = [
                {
                id: groupId,
                type,
                position,
                data,
                style: { backgroundColor: 'rgba(255, 0, 0, 0)', width: 100, height: 100 },
                }
            ];
        
            // setNodes((nds) => nds.concat(nodesToAdd));
            addNodeToScenario(activeScenarioId, newNode);
            } else if (type === 'openAi') {

              
            // openAi node data
            const data = {
                label: 'Open AI',
                image: './openai.svg',
                name: "OpenAI",
                fields: [
                { label: "Field 1", type: "text" },
                { label: "Field 2", type: "number" },
                ]
            };
            // openAi node creation
            const nodeId = getId();
            const newNode = {
                id: getId(nodeType),          
                type,
                position,
                data,
                style: { backgroundColor: 'rgba(255, 0, 0, 0)', width: 100, height: 100 },
            };
            // setNodes((nds) => nds.concat(newNode));
            // Call the action to add the node to the current scenario
            addNodeToScenario(activeScenarioId, newNode);
            } else if (type === 'chain') {

              
              // Chain node data
              const data = {
                  label: 'Chain',
                  image: './chain.svg',
                  name: "Chain",
                  fields: [
                  { label: "Field 1", type: "text" },
                  { label: "Field 2", type: "number" },
                  ]
              };
              // Chain node creation
              const nodeId = getId();
              const newNode = {
                  id: getId(nodeType),          
                  type,
                  position,
                  data,
                  style: { backgroundColor: 'rgba(255, 0, 0, 0)', width: 100, height: 100 },
              };
              // setNodes((nds) => nds.concat(newNode));
              // Call the action to add the node to the current scenario
              addNodeToScenario(activeScenarioId, newNode);
            } else if (type === 'action') {

              
              // Chain node data
              const data = {
                  label: 'Action',
                  image: './action.svg',
                  name: "Action",
                  fields: [
                  { label: "Field 1", type: "text" },
                  { label: "Field 2", type: "number" },
                  ]
              };
              // Chain node creation
              const nodeId = getId();
              const newNode = {
                  id: getId(nodeType),          
                  type,
                  position,
                  data,
                  style: { backgroundColor: 'rgba(255, 0, 0, 0)', width: 100, height: 100 },
              };
              // setNodes((nds) => nds.concat(newNode));
              // Call the action to add the node to the current scenario
              addNodeToScenario(activeScenarioId, newNode);
            }
            else {
            // other node creation
            const newNode = {
            id: getId(nodeType),          
            type,
            position,
            data: { label: `${type}` },
            };
            setNodes((nds) => nds.concat(newNode));
            // Call the action to add the node to the current scenario
            addNodeToScenario(activeScenarioId, newNode);
        }},
        [reactFlowInstance, takeSnapshot, activeScenarioId, addNodeToScenario]
    );

    const onNodesDelete = useCallback(() => {
      // 👇 allow deleting nodes undoable
      takeSnapshot();
    
      // Gather IDs of selected nodes
      const nodeIdsToDelete = currentScenarioNodes.filter(node => node.selected).map(node => node.id);
    
      // Delete selected nodes from the state
      setNodes((prevNodes) => prevNodes.filter(node => !node.selected));
    
      // Call the action to delete the nodes from the current scenario
      deleteNodeFromScenario(activeScenarioId, nodeIdsToDelete);

      // Clear the selected node ID if it's among the deleted nodes
      if (nodeIdsToDelete.includes(selectedNodeId)) {
        setSelectedNodeId(null);
      }
    }, [takeSnapshot, setNodes, deleteNodeFromScenario, activeScenarioId]);
   
    
    const onEdgesDelete = useCallback(() => {
      // Similar to nodes, take a snapshot for undo functionality (assuming you have it for edges too)
      takeSnapshot();
  
      // Check if an edge is selected
      if (!selectedEdgeId) {
          console.warn('No edge selected for deletion.');
          return;
      }
  
      // Call the action to delete the edge from the current scenario
      deleteEdgeFromScenario(activeScenarioId, selectedEdgeId);
  
      // Clear the selected edge ID from the local state
      setSelectedEdgeId(null);
  }, [takeSnapshot, setSelectedEdgeId, deleteEdgeFromScenario, activeScenarioId, selectedEdgeId]);
  
    const onEdgeClick = useCallback((event, edge) => {
      if (selectedEdgeId === edge.id) {
          setSelectedEdgeId(null); // deselect if the same edge is clicked again
          setSelectedEdgeInScenario(activeScenarioId, null); // update scenario state
      } else {
          setSelectedEdgeId(edge.id); // select the edge
          setSelectedEdgeInScenario(activeScenarioId, edge.id); // update scenario state
      }

      
    }, [selectedEdgeId, setSelectedEdgeInScenario, activeScenarioId]);
    
    const onNodeClick = useCallback((event, node) => {
      if (selectedNodeId === node.id) {
          setSelectedNodeId(null); // deselect if the same node is clicked again
          setSelectedNodeInScenario(activeScenarioId, null); // update scenario state
      } else {
          setSelectedNodeId(node.id); // select the node
          setSelectedNodeInScenario(activeScenarioId, node.id); // update scenario state
      }
  
      // Your existing logic
      const connectedNodes = getAllConnectedNodes(currentScenarioNodes.id, currentScenarioEdges);
      console.log('All connected nodes:', connectedNodes);
  
      if (['openAi', 'formGroup', 'chain'].includes(node.type)) {
          setModalNodeId(node.id);
          console.log('modalNodeId:', node.id); 
      }
    }, [selectedNodeId, setSelectedNodeInScenario, activeScenarioId]);
    
  
        
    return (

      <div className="bagpipe-flow-canvass" style={{ width: '100vw', height: '1000px' }}>

        <ThemeProvider theme={theme}>
            <Panel position="top-center">          
                {/* <button className="bg-slate-900  p-3 text-white" onClick={toggleMode}>light / dark</button> */}
            </Panel>
            <div className="bagpipe">
        
            <div style={{ height: 800 }} className="reactflow-wrapper" ref={reactFlowWrapper}>
              <ReactFlowStyled
                  nodes={currentScenarioNodes}
                  edges={combinedEdges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={handleEdgesChange}
                  onConnect={handleConnect}
                  onInit={setReactFlowInstance}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onNodeDrag={onNodeDrag}
                  onNodeDragStop={onNodeDragStop}
                  onNodesDelete={onNodesDelete}
                  onEdgesDelete={onEdgesDelete}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  attributionPosition="top-right"
                  onNodeClick={onNodeClick} 
                  onEdgeClick={onEdgeClick}
                  proOptions={proOptions}
                  fitView
              >
              <Controls />
              <MiniMap />
              {/* <Background id="1" gap={10} color="#f1f1f1" variant={BackgroundVariant.Lines} /> 
             <Background id="2" gap={100} offset={1} color="#ccc" variant={BackgroundVariant.Lines} />  */}
              <Background color='fff' className="" variant={BackgroundVariant.Dots} />
              <ControlsStyled />
              <EdgeLabelRenderer type='' />
              {/* <Panel position="bottom-center">
                <div className={styles.buttonGroup}>
                <button disabled={canUndo} className={styles.button} onClick={undo}>
                    <span className={styles.buttonIcon}>⤴️</span> undo
                </button>
                <button disabled={canRedo} className={styles.button} onClick={redo}>
                    redo <span className={styles.buttonIcon}>⤵️</span>
                </button>
                </div>

            </Panel> */}
            </ReactFlowStyled>
            <PlayButton executeScenario={executeScenario} stopExecution={stopExecution} disabled={loading} />
             
           
            </div>
            <Sidebar />
            {/* {modalNodeId && currentScenarioNodes && currentScenarioEdges && (
                <OpenAINodeForm
                  nodeId={modalNodeId}
                  nodes={currentScenarioNodes}
                  edges={currentScenarioEdges}
                  nodeConnections={nodeConnections}
                  setNodes={setNodes}
                  setEdges={setEdges}
                  onNodesChange={onNodesChange}
                  setModalNodeId={setModalNodeId}
                />
       
              )} */}
            </div>
    </ThemeProvider>
    </div>
  
    );
  }
  
  export default BagpipesFlow;
  