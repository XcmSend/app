import React from "react";
import './Forms.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';

const FormHeader = ({ title, onClose, onHelp, onMoreOptions, logo }) => {
    return (
      <div className="form-header">
        <div className="flex justify-between items-center"><span className=''>{logo}</span>

        <div className='ml-2'>{title}</div></div>
        
        <div className="flex justify-between align-top">
        <Tippy       
        interactive={true}
        trigger="click" 
        theme='light' 
        content={<div><button>test button</button></div>}>
          <button className='form-header-button' onClick={onMoreOptions}>...</button>
        </Tippy>
        <button className='form-header-button' onClick={onHelp}>?</button>

        <button className='form-header-button' onClick={onClose}>x</button>
        </div>
      </div>
    );
  };

  
  export default FormHeader;