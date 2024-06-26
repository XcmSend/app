import React, { useState } from "react";
import FormHeader from "../FormHeader";
import FormFooter from "../FormFooter";
import './Popup.scss';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import { useAppStore } from '../../hooks';



const ScenarioNameForm = ({ onSave, onClose, nodeId, reference }) => {
    const [scenarioName, setScenarioName] = useState("");
    const { hideTippy } = useTippy();
    const saveScenarioName = useAppStore((state) => state.saveScenarioName);


    const handleSubmit = async (event) => {
        event.preventDefault();
        saveScenarioName(nodeId, scenarioName);
        onSave({ name: scenarioName, nodeId });
        hideTippy();
    };

    const handleCancel = () => {
        onClose();
        hideTippy();
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormHeader title='Scenario Name' />
            <input 
                className='border rounded border-gray-300 p-2 mb-2'
                type="text"
                placeholder="My Scenario Name"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
            />
            <FormFooter onClose={handleCancel} onSave={handleSubmit} showToggle={false} />
        </form>
    );
};

export default ScenarioNameForm;
