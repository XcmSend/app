// @ts-nocheck
import React from 'react';
import { Handle, useReactFlow, useStoreApi, Position, useNodeId} from 'reactflow';
import '../../index.css'

export default function OpenAINode({ data }) {
    const { setNodes } = useReactFlow();
    const store = useStoreApi();
    const nodeId = useNodeId();

  return (

  <>
    <div className="flex justify-center custom-node__select" >
      <img className="w-10 self-center " src={data.image} alt="OpenAI Node" />
      
      {/* <Handle style={explainReason} type="target" id="explain_reason" position={Position.Left} />
      <Handle style={explainThought}  type="target" id="explain_thought" position={Position.Left} />
      <Handle style={explainObservation}  type="target" id="explain_observe" position={Position.Left} /> */}
    </div>
        <Handle type="target" id="action" position={Position.Left} />
        <Handle type="source"  position={Position.Right} />
    </>

  );
}
