import React, { useState, useRef } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { WebsocketIcon }  from '../../../Icons/icons';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import './WebsocketNode.scss';
import '../../node.styles.scss';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
// import WebsocketForm from '../../Forms/PopupForms/Websocket/WebsocketForm';

export default function WebsocketNode({ }) {
  const { showTippy } = useTippy();
  const [isWebsocketFormVisible, setWebsocketFormVisible] = useState(false);
  const nodeId = useNodeId();
  const nodeRef = useRef();
  const WebsocketNodeRef = useRef();

  const handleNodeClick = () => {
    
    const rect = nodeRef.current.getBoundingClientRect();
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
    // Adjusting position based on scrolling and potential transformations
    const calculatedPosition = {
      x: rect.right + scrollLeft,
      y: rect.top + scrollTop
    };
  
    // showTippy(null, nodeId, calculatedPosition, <WebsocketForm onSave={handleSubmit} onClose={handleCloseWebsocketForm} nodeId={nodeId} reference={nodeRef.current} />);
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    setWebsocketFormVisible(false);
    // Handle form submission
  };

  const handleCloseWebsocketForm = () => {
    setWebsocketFormVisible(false);
  };


  return (

    <div>
      <div className="flex items-center" ref={nodeRef} onClick={handleNodeClick}>

        <div className="relative nodeBody bg-white border-2 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
    
          <WebsocketIcon className="h-8" fillColor='rgb(255 126 22)' />
          
          {/* Logo in the middle of the circle */}
          <img src={`/chains/polkadot.svg`} alt={`Polkadot Logo`} className="websocket-chain-logo absolute top-0 right-2 text-slate-800 h-8 w-8" />

          {/* Title outside the circle below the logo */}
          <div className="node-title-circle absolute bottom-[-38%] text-center w-full">
            <div className="font-medium text-xl flex justify-center text-gray-500">Websocket</div>
            {/* <div className="websocket font-medium flex justify-center  text-xs absolute bottom-[-58%] text-gray-500">Listening for referendum actions</div> */}

          </div>
          
          <Handle position={Position.Right} type="source" className="z-10" />
        {/* <Handle position={Position.Left} type="target" className="hidden z-10" /> */}
        </div>
      </div>
    </div>
    
    

  );
}


