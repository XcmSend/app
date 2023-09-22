// onConnect.js
import { addEdge } from 'reactflow';

const onConnect = (edges, setEdges, activeScenarioId, addEdgeToScenario) => (params) => {
  console.log("onConnect called with params:", params);

  if (params.source === params.target) {
    console.log('Cannot connect to the same node:', params.source);
    return;
  }

  const newEdgeId = `${params.source}-${params.target}`;
  console.log('newEdgeId:', newEdgeId);
  const newEdge = {
    ...params,
    id: newEdgeId,
  };

  const newEdges = addEdge(newEdge, edges); 
  setEdges(newEdges); // Update edges using explicit setter

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
