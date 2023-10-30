import React from 'react';
import { SendIcon } from '../../Icons/icons';
import { useAppStore } from '../../../components/Bagpipes/hooks';

const SendButton = ({ executeChainScenario, stopExecution }) => {
    const { executionState } = useAppStore((state) => ({
        executionState: state.executionState,
    }));

    const getButtonContent = () => {
        switch (executionState) {
            case 'idle': 
                return (
                    <>
                        <div className='mr-2'><SendIcon /></div> Broadcast
                    </>
                );
            case 'sending': 
            return (
                <>
                     <div className='mr-2'><SendIcon /></div> Sending...
                </>
            );
            case 'stopped': 
                return (
                    <>
                         <div className='mr-2'><SendIcon /></div> Start
                    </>
                );
            default:
                return 'Broadcast';
        }
    }

    return (
        <button 
            className="fixed right-10 bottom-10 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center" 
            style={{ zIndex: 1000 }}
            disabled={executionState === 'sending'}
            onClick={executionState === 'sending' ? stopExecution : executeChainScenario}
        >
            {getButtonContent()}
        </button>
    );
}

export default SendButton;
