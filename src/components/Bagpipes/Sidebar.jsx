// @ts-nocheck
import React from 'react';
import './nodes.jsx';
import '../../index.css'

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeNames = {
    inputPrompt: 'Start',
    output: 'End',
    group: 'Group',
    textUpdater: 'Text Updater',
    formGroup: 'Form Group',
    openAi: 'Open AI',
    api: 'API',
    gmail: 'Gmail',
    vectorDb: 'Vector DB',
    chain: 'Chain',
    action: 'Action',

  }

  return (
    <aside className='fixed top-100 right-0'>
      <div className="description">Drag thes nodes to the canvass, connect them up and build a workflow. </div>
      {/* <div className="dndnode" onDragStart={(event) => onDragStart(event, `input` )} draggable>
        {nodeNames.inputPrompt}
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        {nodeNames.output}
      </div> */}
      {/* <div className="dndnode " onDragStart={(event) => onDragStart(event, 'gmail')} draggable>
        {nodeNames.gmail}
      </div> */}
      {/* <div className="dndnode " onDragStart={(event) => onDragStart(event, 'vectorDb')} draggable>
        {nodeNames.vectorDb}
      </div> */}
      <div className="dndnode " onDragStart={(event) => onDragStart(event, 'api')} draggable>
        {nodeNames.api}
      </div>
      {/* <div className="dndnode " onDragStart={(event) => onDragStart(event, 'openAi')} draggable>
        {nodeNames.openAi}
      </div>     */}
      {/* <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'textUpdater')} draggable>
          {nodeNames.textUpdater}
      </div> */}
      {/* <div className="dndnode formGroup" onDragStart={(event) => onDragStart(event, 'formGroup')} draggable>
        {nodeNames.formGroup}
      </div> */}
      <div className="dndnode chain" onDragStart={(event) => onDragStart(event, 'chain')} draggable>
        {nodeNames.chain}
      </div>
      <div className="dndnode action" onDragStart={(event) => onDragStart(event, 'action')} draggable>
        {nodeNames.action}
      </div>
    </aside>
  );
};
