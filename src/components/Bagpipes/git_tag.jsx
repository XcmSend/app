//latest_git_commit

// @ts-nocheck
import React from 'react';
import { PlayIcon } from '../Icons/icons';
import { useAppStore } from '../../components/Bagpipes/hooks';

import GitCommit from './_git_commit';


const GitInfo = ({ executeScenario, stopExecution }) => {
    return (
        <div className='text-xs pt-3'>
            <center>
            Deployed version: <a href={`https://github.com/XcmSend/xcmsend-ui/commit/${GitCommit}`}>#{GitCommit}</a>
            </center>    
            </div>   
    );
}

export default GitInfo;