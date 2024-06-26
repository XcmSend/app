import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { nodeTypeColorMapping } from '../../nodeColorMapping';
import '../Pills.scss';


const DraggableFunctionPills = ({ name }) => {
    const displayName = name.endsWith('(') ? name.slice(0, -1) : name;

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'FUNCTION_BLOCK',
        item: {
            // Assuming you need similar data as DraggablePills for rendering
            id:  name , 
            label: name, // Use function name as label
            nodeIndex: 0, // Set appropriately if needed
            nodeType: 'function', // Indicate this is a function block
            // You might need to adjust these fields based on what your drop logic expects
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <span ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }} className="pill function-pill">
            <span className="text-black bg-gray-300 p-1 rounded cursor-pointer">
                {displayName}
            </span>
        </span>
    );
};

export default DraggableFunctionPills;
