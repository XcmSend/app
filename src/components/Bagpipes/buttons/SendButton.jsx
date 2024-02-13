import React from 'react';
import { BroadcastIcon } from '../../Icons/icons';
import { useAppStore } from '../../../components/Bagpipes/hooks';
import './Buttons.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const SendButton = ({ executeChainScenario, stopExecution }) => {
    const { executionState } = useAppStore((state) => ({
        executionState: state.executionState,
    }));

    let buttonClass = "start-stop-create-button";
    if (executionState === 'idle') {
        buttonClass += ' idle-effects';
    } else if (executionState === 'sending') {
        buttonClass += ' sending-effects';
    }

    const getTooltipContent = () => {
        switch (executionState) {
            case 'idle':
                return (
                    <div className='bg-white p-4'>
                        <div className='flex justify-between'>
                            <h1 className="text-xl font-bold">Ready to Broadcast</h1>
                            <BroadcastIcon className='h-7 w-7' />
                        </div>
                        <p>Click to start broadcasting the transactions you recently signed.</p>
                        {/* Include any image if necessary */}
                    </div>
                );
            case 'sending':
                return (
                    <div className='bg-white p-4'>Broadcast in progress...</div>
                );
            // Add cases for other states if necessary
            default:
                return <div>Broadcast</div>;
        }
    };

    const getButtonContent = () => {
        switch (executionState) {
            case 'idle': 
                return (
                    <>
                        <div className='mr-2'><BroadcastIcon /></div> Broadcast
                    </>
                );
            case 'sending': 
            return (
                <>
                     <div className='mr-2'><BroadcastIcon /></div> Sending...
                </>
            );
            case 'stopped': 
                return (
                    <>
                         <div className='mr-2'><BroadcastIcon /></div> Start
                    </>
                );
            default:
                return 'Broadcast';
        }
    }

    return (
        <Tippy theme='light' interactive={true} content={getTooltipContent()}>

        <button 
            className={buttonClass} 
            style={{ zIndex: 1000 }}
            disabled={executionState === 'sending'}
            onClick={executionState === 'sending' ? stopExecution : executeChainScenario}
        >
            {getButtonContent()}
        </button>
        </Tippy>
    );
}

export default SendButton;
