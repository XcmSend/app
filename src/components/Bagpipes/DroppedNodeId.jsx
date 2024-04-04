// @ts-nocheck
// Copyright 2024 Bagpipes license, see LICENSE.md 

import React from "react";

const DroppedNodeId = (props) => {
    const { nodeId } = props.contentState.getEntity(props.entityKey).getData();
    const isNodeIdPresent = inputNodes.includes(nodeId);
    
    return (
      <span style={{ color: isNodeIdPresent ? 'green' : 'red' }}>
        {props.children}
      </span>
    );
};

export default DroppedNodeId