// @ts-nocheck
import React from 'react';
import { PlusIcon } from '../Icons/icons';
import './nodes.jsx';
import '../../index.css';

export const CreateButton = ({createScenario}) => {
    return (
        <button 
        className=" button flex items-center dndnode new-scenario  bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" 
        onClick={createScenario} 
            style={{ zIndex: 1000 }}
        >
            {PlusIcon}
            New Scenario
        </button>
    );
}

export default CreateButton;

