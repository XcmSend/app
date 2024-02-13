import React, { useState } from 'react';    
import { useDrop } from 'react-dnd';
import Pill from './Pill';


const TextEditor = () => {
    const [pills, setPills] = useState([]);
    const [text, setText] = useState('');
  
    const [, dropRef] = useDrop({
        accept: 'PILL',
        drop: (item, monitor) => {
            // Add logic to add the dropped pill to the editor
            if (!pills.includes(item.id)) {
                setPills([...pills, item.id]);
            }
        },
    });


    const handleDrop = (e) => {
        const pillId = e.dataTransfer.getData("pill");
        // Logic to insert pill at the drop position
    };
  
    const addPill = (pillData) => {
        setPills([...pills, pillData]);
    };
  
    const removePill = (pillId) => {
        setPills(pills.filter(pill => pill.id !== pillId));
    };
  
    return (
        <div 
                
            ref={dropRef} 
            className="text-editor" 
            onDrop={handleDrop} 
            onDragOver={(e) => e.preventDefault()}
            contentEditable
        >
            {text}
            {pills.map(pill => (
                <Pill key={pill.id} {...pill} onDelete={removePill} />
            ))}
        </div>
    );
  };

  export default TextEditor;