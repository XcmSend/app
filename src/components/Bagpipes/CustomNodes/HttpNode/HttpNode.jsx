import React, { useState, useRef } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { HttpIcon } from '../../../Icons/icons';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import './HttpNode.scss';
import '../../node.styles.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';

import HttpForm from '../../Forms/PopupForms/Http/HttpForm';


export default function HttpNode({ data }) {
  const [isHttpFormVisible, setHttpFormVisible] = useState(false);
  const { showTippy } = useTippy();
  const nodeId = useNodeId();
  const nodeRef = useRef();

  const handleNodeClick = () => {
  
    const rect = nodeRef.current.getBoundingClientRect();
    const parentTippyOffsetX = 0; 
    const parentTippyOffsetY = 0; 


    const calculatedPosition = {
      x: rect.right + parentTippyOffsetX,
      y: rect.top + parentTippyOffsetY
    };    
    showTippy(null, nodeId, calculatedPosition, <HttpForm onSave={handleSubmit} onClose={handleCloseHttpForm} nodeId={nodeId} reference={nodeRef.current} />);
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    setHttpFormVisible(false);
    // Handle form submission
  };


  const handleCloseHttpForm = () => {
    setHttpFormVisible(false);
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };


  return (
    <div onScroll={handleScroll}>    
    
    <div ref={nodeRef} onClick={handleNodeClick}>

    <div className="relative nodeBody border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
      
      <HttpIcon className='h-7 w-7' fillColor='white' />
      {/* Logo in the middle of the circle */}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center">
      <div className="http-name font-medium text-xl flex-col text-gray-500">HTTP Request
      {/* <div className=" font-medium text-xs absolute top-8 right-16 text-gray-500">Get proposal</div> */}
      </div>
      </div>

  
      
      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
      </div>

    </div>

    </div>
  );
}
