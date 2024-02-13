import { Handle, Position } from 'reactflow';
import { DiscordIcon }  from '../../../Icons/icons';
import './DiscordNode.scss'
import '../../node.styles.scss'

export default function DiscordNode({ data }) {
  const { logo, title, showArrow, instruction } = data;

  return (
    <div className="relative nodeBody bg-white border-2 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
      {showArrow && (
        <div className="absolute -top-20 left-3/4 transform ml-4">
          <div className='text-gray-500 font-mono ml-4'>{instruction}</div>
          <div className='text-gray-500 font-mono text-2xl left-1/4 mb-1'>⤹</div>
        </div>
      )}
   <DiscordIcon className="h-8"  />
      
      {/* Logo in the middle of the circle */}
      {/* <img src={`/chains/${logo}`} alt={`${title} Logo`} className="text-slate-800 h-8 w-8" /> */}

      {/* Title outside the circle below the logo */}
      <div className="node-title-circle absolute bottom-[-38%] text-center w-full">
        <span className="font-medium text-xl text-gray-500">Discord</span>
      </div>
      
      <Handle position={Position.Right} type="source" className="z-10" />
      <Handle position={Position.Left} type="target" className="z-10" />
    </div>
  );
}


