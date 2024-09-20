import { Handle, Position } from 'reactflow';
import { BlinkIcon } from '../../../Icons/icons';
import './BlinksNode.scss'

export default function BlinksNode({ data }) {
  const { logo, title, showArrow, instruction } = data;

  return (
    <div className="relative nodeBody bg-white border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
      
    <BlinkIcon className='h-7 w-7' fillColor='black' />
      {/* Logo in the middle of the circle */}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle">
        <span className="node-title">Create Blink</span>
      </div>
      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
    </div>
  );
}
