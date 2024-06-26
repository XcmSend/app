import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../components/Bagpipes/hooks';
import './Lab.scss';
import '../../index.css';
import '../../main.scss';
import { ExecutionIcon, PlusIcon, CloseIcon } from '../../components/Icons/icons';
import { deleteScenarioAsync, fetchPersistedScenarioLogs, loadScenarioAsync, startPersistScenarioAsync, stopPersistScenarioAsync, fetchAllWorkers } from '../../store/AsyncHelpers';
import CreateTemplateLink from '../../components/Bagpipes/TemplateFeatures/CreateTemplateLink';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useCreateScenario } from '../../components/Bagpipes/hooks/useCreateScenario';
import ThemeContext from '../../contexts/ThemeContext';
import Toggle from '../../components/Bagpipes/Forms/Toggle';
import { Button } from 'antd';
import { GenerateLinkButton, ExecutionsButton, DeleteScenarioButton, PersistScenarioToggle } from '../../components/Bagpipes/buttons';
import { useTippy } from '../../contexts/tooltips/TippyContext';
import ScenarioNameForm from '../../components/Bagpipes/Forms/PopupForms/ScenarioNameForm';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { tippyDescriptions}  from '../../components/Bagpipes/buttons/tippyDescriptions';
import OrderedListContent from '../../components/toasts/OrderedListContent';
import { getOrderedList } from '../../components/Bagpipes/hooks/utils/scenarioExecutionUtils';
import transformOrderedList from '../../components/toasts/utils/transformOrderedList';


function Lab() {
    const {
        scenarios,
        addScenario,
        setActiveScenarioId,
        activeScenarioId,
        setNodeContentMap,
        loadScenario,
        persistedScenarios,
        saveScenarioName
    } = useAppStore((state) => ({
        scenarios: state.scenarios,
        addScenario: state.addScenario,
        setActiveScenarioId: state.setActiveScenarioId,
        activeScenarioId: state.activeScenarioId,
        saveScenario: state.saveScenario,
        saveScenarioName: state.saveScenarioName,
        setNodeContentMap: state.setNodeContentMap,
        loadScenario: state.loadScenario,
    }));
    const labelRef = useRef(null);
    const [scenarioNameFormIsVisible, setScenarioNameFormVisible] = useState(null);

    const navigate = useNavigate();
    const createScenario = useCreateScenario();
    const [templateScenarioId, setTemplateScenarioId] = useState(null);
    const { theme } = useContext(ThemeContext);
    const [isToggled, setIsToggled] = useState(false);
    const { showTippy } = useTippy();

    const handleSubmit = (formData) => {
        console.log("Form submitted with data: ", formData);
        // Handle form submission logic here
    };

    const handleCloseScenarioNameForm = () => {
        console.log("Form closed");
        // Handle form close logic here
    };

    const handleTippyScenario = (nodeId, event) => {
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

    const handleToggleChange = async (scenarioId, persist) => {
        const persistFunction = persist ? startPersistScenarioAsync : stopPersistScenarioAsync;
        const success = await persistFunction(scenarioId, persist);
        if (success) {
            return true;
        } else {
            console.error(`Error ${persist ? 'starting' : 'stopping'} persisting scenario state`);
            return false;
        }
    };

    const handleButtonClick = async (scenarioId) => {
        console.log('Button clicked');
        await fetchAllWorkers();
    };

    const editScenario = async (scenarioId) => {
        const loadSuccess = await loadScenarioAsync(scenarioId);
        if (loadSuccess) {
            loadScenario(scenarioId);
            setActiveScenarioId(scenarioId);
            navigate('/builder');
        } else {
            toast.error("Scenario could not be loaded.");
        }
    };

    return (
        <div className={`${theme} lab-container p-8 h-full`}>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold">Scenarios</h1>
                <button className="button bg-blue-500 flex items-center" onClick={createScenario}>
                    <span className='mr-2'><PlusIcon className='' fillColor='white' /></span>Create New Scenario
                </button>
            </div>
            {templateScenarioId && <CreateTemplateLink scenarioId={templateScenarioId} />}
            <div>
                {Object.entries(scenarios).length > 0 ? (
                    Object.entries(scenarios).map(([scenarioId, scenario]) => {
                        const orderedList = getOrderedList(scenario?.diagramData?.edges);
                        const transformedList = transformOrderedList(orderedList, scenario?.diagramData?.nodes);

                        return scenario ? (
                            <div key={scenarioId} className="scenario-card relative cursor-pointer" onClick={(e) => { e.stopPropagation(); editScenario(scenarioId); }}>
                                <Tippy content="Scenario Name" theme='light' interactive={true} duration={[200, 200]} arrow={true}>
                                    <div ref={labelRef} onClick={(e) => { e.stopPropagation(); handleTippyScenario(scenarioId, e); }} className="scenario-name">
                                    {scenario.name || <span className="placeholder-text">Click to name Scenario</span>}
                                        </div>
                                </Tippy>
                                <OrderedListContent list={transformedList} />
                                <div className="scenario-details">
                                    <div className="scenario-id">{scenarioId}</div>
                                    <GenerateLinkButton scenarioId={scenarioId} />
                                    <PersistScenarioToggle scenarioId={scenarioId} isToggled={scenario.persisted} onToggleChange={handleToggleChange} />
                                    <ExecutionsButton scenarioId={scenarioId} />
                                    <DeleteScenarioButton scenarioId={scenarioId} />
                                </div>
                            </div>
                        ) : null;
                    })
                ) : (
                    <p>No scenarios available. Create a new one to get started.</p>
                )}
            </div>
        </div>
    );
}

export default Lab;


