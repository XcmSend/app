// @ts-nocheck
// Copyright 2019-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0
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