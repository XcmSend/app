// @ts-nocheck
import React from 'react';
import './nodes.jsx';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeNames = {
    inputPrompt: 'Input Prompt',
    output: 'Output',
    group: 'Group',
    textUpdater: 'Text Updater',
    formGroup: 'Form Group',
    openAi: 'Open AI',
    api: 'API',
    gmail: 'Gmail',
    vectorDb: 'Vector DB',

  }

  return (
    <aside className='fixed top-100 left-0'>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, `input` )} draggable>
        {nodeNames.inputPrompt}
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        {nodeNames.output}
      </div>
      <div className="dndnode " onDragStart={(event) => onDragStart(event, 'gmail')} draggable>
        {nodeNames.gmail}
      </div>
      <div className="dndnode " onDragStart={(event) => onDragStart(event, 'vectorDb')} draggable>
        {nodeNames.vectorDb}
      </div>
      <div className="dndnode " onDragStart={(event) => onDragStart(event, 'api')} draggable>
        {nodeNames.api}
      </div>
      <div className="dndnode " onDragStart={(event) => onDragStart(event, 'openAi')} draggable>
        {nodeNames.openAi}
      </div>    
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'textUpdater')} draggable>
          {nodeNames.textUpdater}
      </div>
      <div className="dndnode formGroup" onDragStart={(event) => onDragStart(event, 'formGroup')} draggable>
        {nodeNames.formGroup}
      </div>
    </aside>
  );
};
