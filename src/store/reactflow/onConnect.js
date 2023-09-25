import {  MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';


// onConnect.js
import { addEdge } from 'reactflow';
import useAppStore from '../useAppStore';

const DEFAULT_EDGE_STYLE = {
  style: {
    stroke: '#000',
    strokeWidth: 5
  },
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#000',
    strokeWidth: 2
  },
  // type: 'arrow',
  label: 'Edge Label'
};

const onConnect = (currentScenarioEdges, nodeConnections, setEdges, setNodeConnections, activeScenarioId, addEdgeToScenario) => (params) => {
  console.log("onConnect called with params:", params);
  console.log("onConnect called with setEddge:", setEdges);

  // const {  activeScenarioId, addEdgeToScenario,  setEdges, edges } = useAppStore(state => ({
  //   activeScenarioId: state.activeScenarioId,
  //   addEdgeToScenario: state.addEdgeToScenario,
  //   setEdges: state.setEdges,
  //   edges: state.edges,
  // }));

  if (params.source === params.target) {
    console.log('Cannot connect to the same node:', params.source);
    return;
  }

  const newEdgeId = `${params.source}-${params.target}`;
  console.log('newEdgeId:', newEdgeId);
  const newEdge = {
    ...params,
    id: newEdgeId,
    ...DEFAULT_EDGE_STYLE
  };
  console.log('onConnect Constructing new edge:', newEdge);


  const newEdges = addEdge(newEdge, currentScenarioEdges); 
  // setEdges(newEdges); // Update edges using explicit setter

  // // Logic to update nodeConnections
  // const newNodeConnections = {
  //   ...state.nodeConnections, // Note: You might need to get the current state's nodeConnections first
  //   [params.source]: [...(nodeConnections[params.source] || []), params.target]
  // };
  // setNodeConnections(newNodeConnections); // Update nodeConnections using explicit setter


  // Call the specific function to add the edge to the current scenario
  addEdgeToScenario(activeScenarioId, newEdge);
  console.log('[onConnect] newEdge check', newEdge)
};

  
  export default onConnect;
