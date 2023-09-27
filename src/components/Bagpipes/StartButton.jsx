// @ts-nocheck
import React from 'react';
import { PlayIcon } from '../Icons/icons';

const StartButton = ({ draftTransactions }) => {
    return (
        <button 
        className="fixed right-10 bottom-10 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center" 
        onClick={draftTransactions} 
            style={{ zIndex: 1000 }}
        >
            <PlayIcon />
            Start
        </button>
    );
}

export default StartButton;