//latest_git_commit

// @ts-nocheck
import React from 'react';
import { PlayIcon } from '../Icons/icons';
import { useAppStore } from '../../components/Bagpipes/hooks';

import GitCommit from './_git_commit';


const GitInfo = ({ executeScenario, stopExecution }) => {
    return (
        <center>
            Deployed version:  <a href="https://github.com/XcmSend/xcmsend-ui/commit/{GitCommit}">#{GitCommit}</a>
            </center>       
    );
}

export default GitInfo;