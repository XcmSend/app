import React, { useState, useRef, useEffect } from 'react';
import useAppStore from '../../../../../store/useAppStore';
import CollapsibleField from '../../fields/CollapsibleField';
import FormHeader from '../../FormHeader';
import { getOrderedList, findUpstreamNodes } from '../../../hooks/utils/scenarioExecutionUtils';
import { useTippy } from '../../../../../contexts/tooltips/TippyContext';
import { getSavedFormState, setSavedFormState } from '../../../utils/storageUtils';
import { useDrag, useDrop } from 'react-dnd';
import CustomInput from '../../fields/CustomInput';
import toast from 'react-hot-toast';
import { DraggablePills, DraggableKeywordPills, DraggableFunctionPills, DraggableOperandPills, DraggableVariablePills } from './Pills/DraggablePills';
import { operandPills,variablePills, keywordPills, logicFunctionBlocks, functionBlocks } from './Pills/pillsData';
import { extractEventDataFromNodes } from './Pills/pillUtils'; 
import { PillClass, PillGroup } from './Pills/pillsData';
import '../Popup.scss';
import '../../Forms.scss';
import '../../../../../index.css';
import './Pills/Pills.scss';

// import { PanelIcon } from '../../../../Icons/icons';


const PanelForm = ({ nodeId, onClose, notifyChange }) => {
  const dropPositionRef = useRef(null);    
  const { scenarios, activeScenarioId, saveNodeFormData, savePanel, panels, setSelectedPanelInNode, executionId } = useAppStore(state => ({ 
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
        executionId: state.executionId,
        // saveNodeFormData: state.saveNodeFormData,
    
    }));
    const [pills, setPills ]  = useState([]);
    const [activeTab, setActiveTab] = useState('Pills');
    const currentScenario = scenarios[activeScenarioId];
    const node = currentScenario.diagramData.nodes.find(node => node.id === nodeId);
    const savedState = getSavedFormState(nodeId) ?? { inputNodes: node?.data?.inputNodes || [] };
    const [inputNodes, setInputNodes] = useState(node?.data?.inputNodes || []);
    const [content, setContent] = useState([]);

    const handleCancel = () => {
      onClose(); // Invoke the onClose function passed from the parent component
    };

    const handleTabChange = (newTab) => {
      setActiveTab(newTab);
      // Additional logic to update the displayed pills based on the selected tab
    };

    // Function to remove a pill
    const onRemovePill = (pillId) => {
      setPills(currentPills => currentPills.filter(pill => pill.id !== pillId));
      // Additional logic if needed, like updating the combined value or other states
    };

    useEffect(() => {
      // Notify parent when content changes
      if (notifyChange) {
        notifyChange();
      }
    }, [content, notifyChange]);
  

    useEffect(() => {
      console.log('PanelForm checking current scenario ', currentScenario);
      const allNodes = currentScenario.diagramData.nodes;
      const orderedList = getOrderedList(currentScenario.diagramData.edges);
      console.log('orderedList', orderedList);
      const upstreamNodes = findUpstreamNodes(orderedList, nodeId);
      console.log('upstreamNodes', upstreamNodes);
      if (orderedList) {
        const newPills = extractEventDataFromNodes(upstreamNodes, allNodes, orderedList, currentScenario.executions[executionId]);
        console.log('newPills', newPills);  
        setPills(newPills);
      } else {
        console.error('orderedList is undefined');
      }
    }, [currentScenario.diagramData.edges, nodeId, currentScenario.diagramData.nodes, currentScenario.diagramData, executionId]);
  

    // keyword pills
    const generalPills = Object.entries(keywordPills).filter(([key, pill]) => pill.group === PillGroup.General);
    const dateTimePills = Object.entries(keywordPills).filter(([key, pill]) => pill.group === PillGroup.DateTime);
    const logicPills = Object.entries(keywordPills).filter(([key, pill]) => pill.group === PillGroup.Logic);
    const mathPills = Object.entries(keywordPills).filter(([key, pill]) => pill.group === PillGroup.Math);
    const arrayPills = Object.entries(keywordPills).filter(([key, pill]) => pill.group === PillGroup.Array);
    const textBinaryPills = Object.entries(keywordPills).filter(([key, pill]) => pill.group === PillGroup.TextBinary);
    const cryptoHashPills = Object.entries(keywordPills).filter(([key, pill]) => pill.group === PillGroup.CryptoHash);

    // still need to do operandPills
    const generalOperandPills = Object.entries(operandPills).filter(([key, pill]) => pill.group === PillGroup.General);
    const logicOperandPills = Object.entries(operandPills).filter(([key, pill]) => pill.group === PillGroup.Logic);
    const mathOperandPills = Object.entries(operandPills).filter(([key, pill]) => pill.group === PillGroup.Math);
    const arrayOperandPills = Object.entries(operandPills).filter(([key, pill]) => pill.group === PillGroup.Array);
    const dateTimeOperandPills = Object.entries(operandPills).filter(([key, pill]) => pill.group === PillGroup.DateTime);
    const textBinaryOperandPills = Object.entries(operandPills).filter(([key, pill]) => pill.group === PillGroup.TextBinary);
    const cryptoHashOperandPills = Object.entries(operandPills).filter(([key, pill]) => pill.group === PillGroup.CryptoHash);

    // variable pills
    const generalVariablePills = Object.entries(variablePills).filter(([key, pill]) => pill.group === PillGroup.General);
    const logicVariablePills = Object.entries(variablePills).filter(([key, pill]) => pill.group === PillGroup.Logic);
    const mathVariablePills = Object.entries(variablePills).filter(([key, pill]) => pill.group === PillGroup.Math);
    const arrayVariablePills = Object.entries(variablePills).filter(([key, pill]) => pill.group === PillGroup.Array);
    const dateTimeVariablePills = Object.entries(variablePills).filter(([key, pill]) => pill.group === PillGroup.DateTime);
    const textBinaryVariablePills = Object.entries(variablePills).filter(([key, pill]) => pill.group === PillGroup.TextBinary);
    const cryptoHashVariablePills = Object.entries(variablePills).filter(([key, pill]) => pill.group === PillGroup.CryptoHash);


    const renderPillsByClass = (pills, pillClass) => {
      return pills
        .filter(([, pill]) => pill.class === pillClass)
        .map(([key, pill]) => {
          switch (pillClass) {
            case PillClass.Keyword:
              return <DraggableKeywordPills key={key} pill={pill} onRemovePill={onRemovePill} />;
            case PillClass.Operand:
              return <DraggableOperandPills key={key} pill={pill} onRemovePill={onRemovePill} />;
            case PillClass.Variable:
              return <DraggableVariablePills key={key} pill={pill} onRemovePill={onRemovePill} />;

          }
        });
    };

   // Function to render keyword pills
   const renderKeywordPills = () => {
    console.log('keyword pill');
    return Object.entries(keywordPills).map(([key, pill]) => (
      <DraggableKeywordPills key={key} pill={pill} />
   
    ));
  };

  const rendeOperandPills = () => {
    console.log('operand pill');
    return Object.entries(operandPills).map(([key, pill]) => (
      <DraggableOperandPills key={key} pill={pill} />
   
    ));
  };


  
  

  const renderFunctionPills = (group) => {
    console.log('functionBlocks', functionBlocks); 
    return Object.entries(functionBlocks)
      .filter(([key, blocks]) => blocks[0].group === group)
      .map(([key, blocks]) => (
        <DraggableFunctionPills key={key} name={key} />
      ));
  };
  

 

  return (
    <div className="form-container" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <FormHeader 
        onClose={handleCancel}  
        title='Control Panel' 
        onTabChange={handleTabChange}
        activeTab={activeTab}
        // tabToggle={false} switched off tabs for now
      />  
      
      <div className="content">
      

    {activeTab === 'Pills' && (
      <>
        {pills.map(pill => (
          <DraggablePills key={pill.id} pill={pill} depth={0} onRemovePill={onRemovePill} />
        ))}
      </>
    )}

    {activeTab === 'Keywords' && renderKeywordPills()}  
    {activeTab === 'General' && (
      <>
           <h3>Keywords</h3>
      <div className="pills-container">   
        {renderPillsByClass(generalPills, PillClass.Keyword)}
    </div>
    <h3>Functions</h3>
        <div className="pills-container">
        {renderFunctionPills('general')}
      </div>
      <h3>Operands</h3>
      <div className="pills-container">   
        {renderPillsByClass(generalOperandPills, PillClass.Operand)}
    </div>
    <h3>Variables</h3>
      <div className="pills-container">   
        {renderPillsByClass(generalVariablePills, PillClass.Variable)}
    </div>
      </>
    )}
    {activeTab === 'Logic' && (
      <>
        <h3>Keywords</h3>
        <div className="pills-container">   

        {renderPillsByClass(logicPills, PillClass.Keyword)}
        </div>
        <h3>Functions</h3>
        <div className="pills-container">   

          {renderFunctionPills('logic')}
          </div>
          <h3>Operands</h3>
      <div className="pills-container">   
        {renderPillsByClass(logicOperandPills, PillClass.Operand)}
    </div>
      </>
    )}
    {activeTab === 'Math' && (
      <>
        <h3>Keywords</h3>
        <div className="pills-container">   

        {renderPillsByClass(mathPills, PillClass.Keyword)}
        </div>
        <h3>Functions</h3>
        <div className="pills-container">   

          {renderFunctionPills('math')}
          </div>
          <h3>Operands</h3>

          <div className="pills-container">   
        {renderPillsByClass(textBinaryOperandPills, PillClass.Operand)}
    </div>
      </>
    )}
      
   {activeTab === 'DateTime' && (

    <>
      <h3>Keywords</h3>
      <div className="pills-container">   
      {renderPillsByClass(dateTimePills, PillClass.Keyword)}
      </div>

      <h3>Functions</h3>
      <div className="pills-container">   
        {renderFunctionPills('date-time')}
        </div>
    </>
    )}
    {activeTab === 'Operands' && (
      <>
        <h3>Keywords</h3>
        <div className="pills-container">   

        {renderPillsByClass(operandPills, PillClass.Keyword)}
        </div>
        <h3>Functions</h3>
        <div className="pills-container">   
          {renderFunctionPills('general')}
          </div>
      </>
    )}
    {activeTab === 'Arrays' && (
      <>
        <h3>Keywords</h3>
        <div className="pills-container">   

        { renderPillsByClass(arrayPills, PillClass.Keyword)}
        </div>
        <h3>Functions</h3>
        <div className="pills-container">   

          {renderFunctionPills('array')}
          </div>
      </>
    )}

    {activeTab === 'TextBinary' && (
          <>
            <h3>Keywords</h3>
            <div className="pills-container">   

            { renderPillsByClass(textBinaryPills, PillClass.Keyword)}
            </div>
            <h3>Functions</h3>
            <div className="pills-container">   

              {renderFunctionPills('text-binary')}
              </div>
              <h3>Operands</h3>
          <div className="pills-container">   
            {renderPillsByClass(textBinaryOperandPills, PillClass.Operand)}
        </div>
          </>
        )}

    {activeTab === 'CryptoHash' && (
          <>
            <h3>Keywords</h3>
            <div className="pills-container">   

            { renderPillsByClass(cryptoHashPills, PillClass.Keyword)}
            </div>
            <h3>Functions</h3>
            <div className="pills-container">   

              {renderFunctionPills('crypto-hash')}
              </div>
              <h3>Operands</h3>
          <div className="pills-container">   
            {renderPillsByClass(cryptoHashOperandPills, PillClass.Operand)}
        </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PanelForm;




const DraggableNode = ({ nodeId, type, label }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'NODE',
    label: 'test',
    item: { id: nodeId, type, label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // useEffect(() => {
  //   if (preview) {
  //     const dragPreview = document.createElement('div');
  //     dragPreview.innerHTML = `➕<span class="bg-green-500 w-full text-white mt-1 p-1 border-green-500 rounded">${type}</span>`; 
  //     dragPreview.style.position = "absolute";
  //     dragPreview.style.top = "-1000px";
  //     document.body.appendChild(dragPreview);
  //     preview(dragPreview);
  //   }
  // }, [preview]);

  return (
    <div ref={drag} className='mt-3 mb-2'style={{ opacity: isDragging ? 0.5 : 1 }}>
      {/* Content of your draggable element */}
      <span className="bg-green-500 w-full text-white mt-1 p-1 border-green-500 rounded cursor-pointer">{type}</span>
    </div>
  );
};


