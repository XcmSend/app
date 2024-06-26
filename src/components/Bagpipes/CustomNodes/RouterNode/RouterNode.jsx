import React, { useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { RouterNodeIcon } from '../../../Icons/icons';
import AntdSelector from '../../Forms/PopupForms/ActionSelector';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/scale.css';

import './RouterNode.scss';
import '../../node.styles.scss';

import '../CustomTooltipMenu.scss';


export default function RouterNode({ data }) {
  const nodeRef = useRef();
  const { logo, title, showArrow, instruction } = data;

  const TooltipContent = () => {
    const radius = 50; // Adjust this radius to position the items further or closer from the node center
    const angleStep = (Math.PI / 6); // Reduce angle step to bring items closer

    const positions = [
        {
            left: 50 + radius * Math.cos(-angleStep) + '%',
            top: 50 - radius * Math.sin(-angleStep) + '%',
            transform: 'translate(-50%, -50%)'
        },
        {
            left: 50 + radius * Math.cos(0) + '%',
            top: 50 - radius * Math.sin(0) + '%',
            transform: 'translate(-50%, -50%)'
        },
        {
            left: 50 + radius * Math.cos(angleStep) + '%',
            top: 50 - radius * Math.sin(angleStep) + '%',
            transform: 'translate(-50%, -50%)'
        }
    ];

    return (
        <div className="tooltip-content">
            <div className="tooltip-item" style={positions[0]}>Edit</div>
            <div className="tooltip-item" style={positions[1]}>Publish</div>
            <div className="tooltip-item" style={positions[2]}>Delete</div>
        </div>
    );
};

  return (
    <Tippy
      content={<TooltipContent />}
      reference={nodeRef}
      theme="custom"
      animation="scale" 
      duration={[200, 200]} 
      arrow={false}
      trigger="mouseenter focus" 
      placement="top" 
    >

    <div className="relative nodeBody bg-white border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
      {showArrow && (
        <div className="absolute -top-20 left-3/4 transform ml-4">
          <div className='text-gray-500 font-mono ml-4'>{instruction}</div>
          <div className='text-gray-500 font-mono text-2xl left-1/4 mb-1'>⤹</div>
        </div>
      )}
      
<RouterNodeIcon className='h-7 w-7' fillColor='indigo' />
      {/* Logo in the middle of the circle */}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center w-full">
        <span className="font-medium text-xl text-gray-500">Router</span>
      </div>
      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
    </div>
    </Tippy>
  );
}
