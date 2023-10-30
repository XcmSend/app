import React from 'react';
import ReactFlow, { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true }];


const Builder: React.FC = () => {
  return (
    <div style={{ height: 800 }}>
    <ReactFlow nodes={initialNodes} edges={initialEdges} />
    </div>
  );
};

export default Builder;