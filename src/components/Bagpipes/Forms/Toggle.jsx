import React from 'react';
import { Switch } from 'antd';
import 'antd/dist/antd.css';
import './Forms.scss';

const Toggle = ({ title, isToggled, onToggleChange }) => {

  const handleToggle = (checked) => {
    onToggleChange(checked);
  };
  
  return (
    <div className='flex items-center' >
      <Switch className="custom-switch bg-blue-500 text-blue-500" checked={isToggled} onChange={handleToggle} />
      <label className='ml-2 text-xxs text-gray-500'>{title}</label>
    </div>
  );
};

export default Toggle;