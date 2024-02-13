import React from "react";
import { CreateUiButton, CreateButton, SendButton, StartButton } from "../buttons";
import './TopBar.scss';  

const TopBar = ({ createScenario, handleExecuteChainScenario, handleDraftTransactions, shouldExecuteChainScenario }) => {

    return (

        <div className='top-bar'>
            <CreateUiButton />
            <CreateButton createScenario={createScenario} />
            {shouldExecuteChainScenario ? (
                <SendButton executeChainScenario={handleExecuteChainScenario} />
            ) : (
            <StartButton draftTransactions={handleDraftTransactions} />
            )}
        </div>
    )
};

export default TopBar;