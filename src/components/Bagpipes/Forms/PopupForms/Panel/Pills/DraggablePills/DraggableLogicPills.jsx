import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { nodeTypeColorMapping } from '../../nodeColorMapping';



const DraggableLogicPills = ({ pill, onRemovePill }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'LOGIC_PILL',
    item: pill,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }} className="pill logic-pill">
      {pill.label}
      {/* Implement removal or other interactions as needed */}
    </div>
  );
};

export default DraggableLogicPills;


