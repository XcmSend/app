// import { create } from 'zustand';
// import { Node, Connection, Edge, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

// const initialNodes: Node[] = [];
// const initialEdges: Edge[] = [];

// type RFState = {
//   rfNodes: Node[];
//   rfEdges: Edge[];
//   addNode: (node: Node) => void;
//   removeNode: (nodeId: string) => void;
//   addEdge: (connection: Connection) => void;
//   updateNode: (nodeId: string, newNodeData: any) => void;
// };

// const useStore = create<RFState>((set, get) => ({
//   rfNodes: initialNodes,
//   rfEdges: initialEdges,
//   addNode: (node: Node) => set(state => ({ rfNodes: [...state.rfNodes, node] })),
//   removeNode: (nodeId: string) => set(state => ({ rfNodes: state.rfNodes.filter(node => node.id !== nodeId) })),
//   addEdge: (connection: Connection) => set(state => ({ rfEdges: addEdge(connection, state.rfEdges) })),
//   updateNode: (nodeId: string, newNodeData: any) => set(state => ({
//     rfNodes: state.rfNodes.map(node => node.id === nodeId ? { ...node, data: { ...node.data, ...newNodeData } } : node)
//   }))
// }));

// export default useStore;
