import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../components/Bagpipes/hooks';
import Scenario from './Scenario';
import './Lab.scss';
import '../../index.css';
import '../../main.scss';
import { EditIcon, PlusIcon, CloseIcon } from '../../components/Icons/icons';
import { deleteScenarioAsync, loadScenarioAsync } from '../../store/AsyncHelpers';
import CreateTemplateLink from '../../components/Bagpipes/TemplateFeatures/CreateTemplateLink';
import ScenarioService from '../../services/ScenarioService';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useCreateScenario } from '../../components/Bagpipes/hooks/useCreateScenario';
import ThemeContext from '../../contexts/ThemeContext';

function Lab() {
    const { scenarios, addScenario, setActiveScenarioId, activeScenarioId, setNodeContentMap, activeExecutionId, setActiveExecutionId, loadScenario } = useAppStore((state) => ({
        scenarios: state.scenarios,
        addScenario: state.addScenario,
        setActiveScenarioId: state.setActiveScenarioId,
        activeScenarioId: state.activeScenarioId,
        saveScenario: state.saveScenario,
        setNodeContentMap: state.setNodeContentMap,
        loadScenario: state.loadScenario,
    }));
    const navigate = useNavigate();
    const createScenario = useCreateScenario();
    const [templateScenarioId, setTemplateScenarioId] = useState(null);
    const { theme } = React.useContext(ThemeContext);

    // const saveScenario = (scenarioId) => {
    //     const scenarioToSave = scenarios[scenarioId];
    //     if (scenarioToSave) {
    //       // Add logic to save the current scenario...
    //       // This could involve storing it in local storage, sending it to your backend, etc.
    //     } else {
    //       console.error('Scenario ID is missing or incorrect. Cannot save scenario.');
    //     }
    //   };
    
    
      const editScenario = async (scenarioId) => {
        const loadSuccess = await loadScenarioAsync(scenarioId);
        
        if (loadSuccess) {
          console.log("[editScenario] active scenario id in edit scenario", activeScenarioId);
          loadScenario(scenarioId);
          setActiveScenarioId(scenarioId);


          navigate('/builder');
        } else {
          console.log("Scenario could not be loaded."); // Or some other error handling
          toast.error("Scenario could not be loaded."); // Or some other error handling

        }
      };
        
          
    

          return (
            <div className={`${theme} lab-container p-8 h-full`}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold">Lab</h1>
                <button 
                  className="button flex items-center"
                  onClick={createScenario}
                >
                   <span className='mr-2'>{PlusIcon}</span>
                  Create New Scenario
                </button>
              </div>
              {templateScenarioId && <CreateTemplateLink scenarioId={templateScenarioId} />}

              
              <div>
                {Object.entries(scenarios).length > 0 ? (
                  Object.entries(scenarios).map(([scenarioId, scenario]) => (
                    scenario ? (
                      <div 
                        key={scenarioId}
                        className="scenario-card relative cursor-pointer"
                        onClick={() => navigate(`/scenario/${scenarioId}`)}
                      >
                        <div className="scenario-content">
                        <div className=''>{scenario.name}</div>
                          <div className="">Scenario {scenarioId} </div>

                          <CreateTemplateLink scenarioId={scenarioId} />


                        
                          <button 
                            className="lab-buttons flex items-center"
                            onClick={(e) => { e.stopPropagation(); editScenario(scenarioId); }}
                          >
                            {EditIcon}
                            <span className='ml-2'>Edit</span>
                          </button>
                          <button 
                            className="close-button-right flex items-center"
                            onClick={(e) => { e.stopPropagation(); deleteScenarioAsync(scenarioId); }}
                          >
                            <CloseIcon />
                           
                          </button>
                        </div>
                      </div>
                    ) : null
                  ))
                ) : (
                  <p>No scenarios available. Create a new one to get started. </p>
                )}
              </div>
            </div>
          );
        }
        
        export default Lab;