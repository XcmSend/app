import React, { useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { DelayIcon } from '../../../Icons/icons';
import AntdSelector from '../../Forms/PopupForms/ActionSelector';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
import './DelayNode.scss';
import '../../node.styles.scss';


export default function DelayNode({ data }) {
  const nodeRef = useRef();
  const { logo, title, showArrow, instruction } = data;

  return (
  //   <Tippy
  //   content={<AntdSelector />}
  //   interactive={true}
  //   trigger="click"
  //   placement="auto"
  //   reference={nodeRef}
  //   theme="light"
  // >
    <div className="relative nodeBody bg-white border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
      
      <DelayIcon className='h-7 w-7' fillColor='indigo' />

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center w-full">
        <span className="font-medium text-xl text-gray-500">Delay</span>
      </div>
      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
    </div>
    // </Tippy>
  );
}
