import React, { useState, useRef } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { OpenAIIcon } from '../../../Icons/icons';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import './ChatGpt.scss';
import '../../node.styles.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';

// import OpenAIForm from '../../Forms/PopupForms/OpenAI/OpenAINodeForm';

export default function ChatGptNode({ data }) {
  const [isOpenAIFormVisible, setOpenAIFormVisible] = useState(false);
  const { showTippy } = useTippy();
  const nodeId = useNodeId();
  const nodeRef = useRef();

  const handleNodeClick = () => {
  
    const rect = nodeRef.current.getBoundingClientRect();
    const parentTippyOffsetX = 0; 
    const parentTippyOffsetY = 0; 

    showTippy(null, nodeId, nodeRef.current, <OpenAIForm onSave={handleSubmit} onClose={handleCloseOpenAIForm} nodeId={nodeId} reference={nodeRef.current} />);
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    setOpenAIFormVisible(false);
    // Handle form submission
  };


  const handleCloseOpenAIForm = () => {
    setOpenAIFormVisible(false);
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };

  return (
    <div onScroll={handleScroll}>    
    
    <div ref={nodeRef} onClick={handleNodeClick}>

    <div className="relative nodeBody border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
      
      <OpenAIIcon className='h-7 w-7' fillColor='black' />
      {/* Logo in the middle of the circle */}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center">
      <div className="font-medium open-ai-name text-gray-500">Chat GPT</div>
      {/* <div className="text-xs font-medium text-gray-500">GPT Assistant</div> */}


      </div>

  
      
      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
      </div>

    </div>

    </div>
  );
}


