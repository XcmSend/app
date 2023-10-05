// @ts-nocheck
import React, { useContext } from 'react';
import './nodes.jsx';
import '../../index.css';
import { CreateButton } from './CreateButton';
import { useCreateScenario } from './hooks/useCreateScenario';
import ThemeContext from '../../contexts/ThemeContext';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const { theme } = useContext(ThemeContext);
  console.log('Sidebar theme', theme);
  const createScenario = useCreateScenario();


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
<aside className={`${theme} sidebar fixed top-100 right-0 ${theme}`}>
        <CreateButton createScenario={createScenario} />
      <div className="description">Drag thes nodes to the canvass, connect them together and build a workflow. </div>
    
      <div className={`dndnode chain`} onDragStart={(event) => onDragStart(event, 'chain')} draggable>
        {nodeNames.chain}
      </div>
      <div className="dndnode action" onDragStart={(event) => onDragStart(event, 'action')} draggable>
        {nodeNames.action}
      </div>
    </aside>
  );
};
