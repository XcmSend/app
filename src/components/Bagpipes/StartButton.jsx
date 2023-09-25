// @ts-nocheck
import React from 'react';

const StartButton = ({ draftTransactions }) => {
    return (
        <button 
            className="fixed right-20 bottom-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center" 
            onClick={draftTransactions} 
            style={{ zIndex: 1000 }}
        >
            Start
        </button>
    );
}

export default StartButton;