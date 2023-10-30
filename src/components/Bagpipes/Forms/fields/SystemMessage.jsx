// @ts-nocheck
import React from 'react';
import RichTextEditor from '../../RichTextEditor/RichTextEditor';

const SystemMessage = ({ value, onChange }) => {
  return (
    <div className='field'>
      <label className='label'>System Message:</label>
      <div className='control'>
        <RichTextEditor 
          value={value} 
          onChange={onChange}
          style={{ height: '100px' }} // Smaller initial height
        />
      </div>
    </div>
  );
};

export default SystemMessage;
