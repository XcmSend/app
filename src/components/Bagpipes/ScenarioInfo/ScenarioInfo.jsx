import React, { useRef, useState, useEffect } from 'react';
import './ScenarioInfo.scss';
import '../../../index.css';

import useAppStore from '../../../store/useAppStore';
import Tippy from '@tippyjs/react';
import { useTippy } from '../../../contexts/tooltips/TippyContext';
import ScenarioNameForm from '../Forms/PopupForms/ScenarioNameForm';
import OrderedListContent from '../../toasts/OrderedListContent';
import { getOrderedList } from '../../Bagpipes/hooks/utils/scenarioExecutionUtils';
import transformOrderedList from '../../toasts/utils/transformOrderedList';
import { GenerateLinkButton, ExecutionsButton, DeleteScenarioButton, PersistScenarioToggle } from '../../Bagpipes/buttons';



const ScenarioInfo = () => {
    const { activeScenarioId, scenarios, setActiveScenarioId } = useAppStore(state => ({
      activeScenarioId: state.activeScenarioId,
      scenarios: state.scenarios,
      setActiveScenarioId: state.setActiveScenarioId,
    }));
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { showTippy } = useTippy();
    const labelRef = useRef(null);
    const dropdownRef = useRef(null);
  
    const scenario = scenarios[activeScenarioId];
  
    const handleCloseScenarioNameForm = () => {
      console.log("Form closed");
    };
  
    const handleTippyScenario = (nodeId, event) => {
      event.stopPropagation(); // Prevent triggering the dropdown Tippy
      const target = event.target;
      const rect = target.getBoundingClientRect();
      const position = {
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 300 // Offset to the right
      };
  
      showTippy(
        position,
        nodeId,
        target,
        <ScenarioNameForm onSave={handleSubmit} onClose={handleCloseScenarioNameForm} nodeId={nodeId} reference={labelRef.current} />, 'right-start'
      );
    };
  
    const handleSubmit = (formData) => {
      console.log("Form submitted with data: ", formData);
    };
  
    const handleSelectScenario = (scenarioId) => {
      setActiveScenarioId(scenarioId);
      setDropdownVisible(false);
    };

    
  
    return (
        <>
        {dropdownVisible && <div className="overlay" onClick={() => setDropdownVisible(false)}></div>}
  
      <Tippy
        content={<ScenarioDropdown onSelectScenario={handleSelectScenario} />}
        interactive={true}
        theme='light'
        placement="bottom-end"
        trigger="click"
        onShow={() => setDropdownVisible(true)}
        onHide={() => setDropdownVisible(false)}
        appendTo={() => document.body}
      >
        <div className='scenario-info-container'>
          <div className='scenario-info' onClick={(e) => { e.stopPropagation(); }}>
            <ScenarioName 
              name={scenario.name} 
              onClick={ handleTippyScenario.bind(null, activeScenarioId)}
              labelRef={labelRef} 
            />
          </div>
        </div>
      </Tippy>
      </>
    );
  };
  
export default ScenarioInfo;


const ScenarioName = ({ name, onClick, labelRef }) => (
  <Tippy content="Click to change the scenario name" theme='light' interactive={true} duration={[200, 200]} arrow={true} placement="right"  appendTo={() => document.body}>
    <div ref={labelRef} onClick={onClick} className="scenario-name">
      {name || <span className="placeholder-text">Click to name Scenario</span>}
    </div>
  </Tippy>
);




const ScenarioDropdown = ({ onSelectScenario }) => {
    const { scenarios, activeScenarioId } = useAppStore(state => ({
      scenarios: state.scenarios,
      activeScenarioId: state.activeScenarioId,
    }));
  
    const { showTippy } = useTippy();
    const labelRef = useRef(null);
  
    const formatScenarioId = (scenarioId) => {
      return `${scenarioId.slice(0, 4)}...${scenarioId.slice(-4)}`;
    };
  
    const handleTippyScenario = (nodeId, event) => {
      event.stopPropagation(); // Prevent triggering the dropdown Tippy
      const target = event.target;
      const rect = target.getBoundingClientRect();
      const position = {
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 300 // Offset to the right
      };
  
      showTippy(
        position,
        nodeId,
        target,
        <ScenarioNameForm onSave={handleSubmit} onClose={handleCloseScenarioNameForm} nodeId={nodeId} reference={labelRef.current} />, 'right-start'
      );
    };
  
    const handleCloseScenarioNameForm = () => {
      console.log("Form closed");
    };
  
    const handleSubmit = (formData) => {
      console.log("Form submitted with data: ", formData);
    };
  
  
    return (
      <div className="scenario-dropdown">
        {Object.entries(scenarios).map(([scenarioId, scenario]) => {
          const orderedList = getOrderedList(scenario?.diagramData?.edges);
          const transformedList = transformOrderedList(orderedList, scenario?.diagramData?.nodes);
          
            const isActive = activeScenarioId === scenarioId;
          return (
           
              <div  className={`scenario-dropdown-item  ${isActive ? 'active' : ''}`} onClick={() => onSelectScenario(scenarioId)} > 
                {/* <div  className='scenario-dropdown-name' ref={labelRef} onClick={(e) => handleTippyScenario(scenarioId, e)}> */}
                    {/* <Tippy 
                        key={scenarioId} 
                        content={<div className='tippy-scenario-name'>Click to change the scenario name</div>} 
                        theme='light' interactive={true} duration={[200, 200]} 
                        arrow={true} 
                        placement="right"
                        appendTo={() => document.body}
                    > */}
                        <span className='scenario-dropdown-name'>{scenario.name || <span className="placeholder-text">Unnamed Scenario</span>}</span>
                    {/* </Tippy> */}
                {/* </div> */}

                <span className="scenario-id">{formatScenarioId(scenarioId)}</span>
                <OrderedListContent list={transformedList} />
                <ExecutionsButton scenarioId={scenarioId} />
              </div>



          );
        })}
      </div>
      
    );
  };



  