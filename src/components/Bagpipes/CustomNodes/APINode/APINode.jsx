import { Handle, Position } from 'reactflow';
import { APINodeIcon } from '../../../Icons/icons';
import './APINode.scss';
import '../../node.styles.scss';

export default function APINode({ data }) {
  const { logo, title, showArrow, instruction } = data;

  return (
    <div className="relative nodeBody bg-white border-4 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
      {showArrow && (
        <div className="absolute -top-20 left-3/4 transform ml-4">
          <div className='text-gray-500 font-mono ml-4'>{instruction}</div>
          <div className='text-gray-500 font-mono text-2xl left-1/4 mb-1'>⤹</div>
        </div>
      )}
      
<APINodeIcon className='h-7 w-7' fillColor='blue' />
      {/* Logo in the middle of the circle */}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center">
        <div className="font-medium api-name text-gray-500">API Call</div>
      </div>
      
      <Handle position={Position.Right} type="source" className=" z-10" />
      <Handle position={Position.Left} type="target" className=" z-10" />
    </div>
  );
}
