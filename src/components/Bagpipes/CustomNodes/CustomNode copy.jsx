// @ts-nocheck
import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ id, fieldsComponent: FieldsComponent, ...rest }) => {
  return (
    <div className="custom-node">
      <div className="custom-node__nav">
        <p className="custom-node__title">{id}</p>
      </div>
      <FieldsComponent {...rest} />
      <Handle type="target" id="action" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNode;

  