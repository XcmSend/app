import { Handle, Position } from 'reactflow';
import { DiscordIcon }  from '../../../Icons/icons';
import './DiscordNode.scss'
import '../../node.styles.scss'

export default function DiscordNode({ data }) {

  return (
    <div className="relative nodeBody bg-white border-2 border-gray-300 rounded-full w-20 h-20 flex items-center justify-center">
      <DiscordIcon className="h-8"  />
      <div className="node-title-circle absolute bottom-[-38%] text-center w-full">
        <span className="font-medium text-xl text-gray-500">Discord</span>
      </div>
      <Handle position={Position.Right} type="source" className="z-10" />
      <Handle position={Position.Left} type="target" className="z-10" />
    </div>
  );
}


