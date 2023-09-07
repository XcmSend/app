// @ts-nocheck
import React from 'react';
import { PlayIcon } from '../../components/Icons/icons';
import { useAppStore } from '../../components/Bagpipes/hooks';

const PlayButton = ({ executeScenario, stopExecution }) => {

    const { loading } = useAppStore((state) => ({
        loading: state.loading,
    }));

    // add messages for the status of the scenario which are 

    return (
        
            <button 
                className="fixed right-10 bottom-10 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center" 
                onClick={loading ? stopExecution : executeScenario} 
                style={{ zIndex: 1000 }}
            >
                {loading ? 'Stop' : <> {<PlayIcon />} Play </>}
            </button>
        
        
    );
}

export default PlayButton;