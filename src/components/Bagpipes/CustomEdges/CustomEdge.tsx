import React from 'react';
import { getBezierPath, BaseEdge } from 'reactflow';

export default function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) {
  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  const [path] = getBezierPath(edgePathParams);
const markerEnd = 'arrowclosed';
  return <BaseEdge path={path} markerEnd={markerEnd} />;
}
