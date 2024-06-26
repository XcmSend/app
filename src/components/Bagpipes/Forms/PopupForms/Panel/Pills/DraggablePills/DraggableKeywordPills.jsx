import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { nodeTypeColorMapping } from '../../nodeColorMapping';
import '../Pills.scss';

const DraggableKeywordPills = ({ pill, onRemovePill }) => {
    // Assuming each 'pill' object has a 'name' property and possibly others like 'id'.
    // You might need to adjust the properties based on your actual 'pill' object structure.
    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: 'KEYWORD_PILL', // This type should match what your drop logic 'accepts'.
      item: {
          id: pill.id, // Ensure each pill has a unique 'id'.
          label: pill.name, // Use 'name' as the label for consistency.
          nodeIndex: pill.nodeIndex || 0, // Use an actual 'nodeIndex' if available, or default to 0.
          nodeType: 'keyword', // Specify the pill type; could also dynamically use pill.type if applicable.
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1, backgroundColor: 'green' }} className="pill keyword-pill">
        <span className="text-white p-1 rounded cursor-pointer">
          {pill.name}
        </span>
      </div>
    );
};

  export default DraggableKeywordPills;
  
  
  