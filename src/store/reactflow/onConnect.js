import {  MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

// onConnect.js
import { addEdge } from 'reactflow';

// let edgeLabel = "Default Label";
let edgeLabel = "";


export const EDGE_STYLES = {
  default: {
    style: {
      stroke: 'gray',
      strokeWidth: 1,
    },
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'gray',
      strokeWidth: 2,
    },
    type: 'step',
    label: 'Edge Label',
  },
  executing: {
    style: {
      stroke: 'green',
      strokeWidth: 3,
    },
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'green',
      strokeWidth: 3,
    },
    label: 'Executing...',
  },

  default_connected: {
    style: {
      stroke: `green`,
      strokeWidth: 2,
    },
    // animated: true,
    markerEnd: {
      type: MarkerType.Arrow,
      // color: ``,
      strokeWidth: 1
    },
    type: 'arrow',
    label: edgeLabel,
    labelShowBg: true,
    labelStyle: {backgroundColor: 'green'}, 
    focusable: true,
    type: 'simplebezier',

  
  }
};



const onConnect = (currentScenarioEdges, nodeConnections, setEdges, setNodeConnections, activeScenarioId, addEdgeToScenario ) => (params) => {
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
    ...EDGE_STYLES.default_connected,
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
