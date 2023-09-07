// @ts-nocheck
import React from 'react';

const models = ['gpt-4', 'gpt-4-32k', 'gpt-3.5-turbo'];

const Model = ({ value, onChange }) => {
  return (
    <div className='field'>
      <label className='label'>Model</label>
      <div className='control'>
        <div className='select'>
          <select 
            className='w-full p-2 border border-gray-300 rounded-md' 
            value={value}
            onChange={onChange}  
          >
            {models.map((modelOption) => (
              <option key={modelOption} value={modelOption}>
                {modelOption}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Model;
