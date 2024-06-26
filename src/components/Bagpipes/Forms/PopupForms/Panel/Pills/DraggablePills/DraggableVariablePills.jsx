import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { nodeTypeColorMapping } from '../../nodeColorMapping';
import '../Pills.scss';


const DraggableVariablePills = ({ pill, onRemovePill }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: 'VARIABLE_PILL',
      item: pill,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    return (
      <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }} className="pill operand-pill">
        <span style={{backgroundColor: 'blue'}} className={`w-full text-white p-1 rounded cursor-pointer`}>
          {pill.name} </span>
        {/* Implement removal or other interactions as needed */}
      </div>
    );
  };
  
  export default DraggableVariablePills;
  
  
  