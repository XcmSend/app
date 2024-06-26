import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { nodeTypeColorMapping } from '../../nodeColorMapping';



const DraggablePills = ({ pill, depth, onRemovePill, onToggleExpand }) => {
    const pillColor = nodeTypeColorMapping[pill.nodeType] || nodeTypeColorMapping.defaultColor;
    // console.log(`Node type draggable: ${pill.nodeType}, Color: ${pillColor}`);

    const [isExpanded, setIsExpanded] = useState(false);
    const [{ isDragging }, drag, preview] = useDrag(() => ({
      type: 'PILL',
      item: { id: pill.id, label: pill.label, nodeIndex: pill.nodeIndex, nodeType: pill.nodeType },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
      if (onToggleExpand) {
        onToggleExpand(pill.id, !isExpanded);
      }
    };

    return (
      <div className='flex m-2'>
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, marginLeft: `${depth * 20}px`}}>
        {pill.children.length > 0 && (
          <span className='p-1 m-1 cursor-pointer' onClick={toggleExpand}>{isExpanded ? '-' : '+'}</span>
        )}
        <span style={{backgroundColor: pillColor}} className={`w-full text-white mt-2 p-1 border-green-500 rounded cursor-pointer`}>
        {/* {pill.nodeIndex}. {pill.label} */}
        {pill.label}
          
        </span> 
        {isExpanded && pill.children.map(child => (
          <DraggablePills key={child.id} pill={child} depth={depth + 1} onRemovePill={onRemovePill} />
        ))}
      </div>
      <span  className='ml-2 text-gray-500'>{pill.value}</span>
      </div>
    );
  };
  
  export default DraggablePills;    