import React, { useState } from "react";
import Toggle from "./Toggle";
import './Forms.scss';

const FormFooter = ({ submitButton = 'Ok', cancelTitle = 'Cancel', onSave, onClose, showToggle = true, toggleTitle = 'Advanced Settings', onToggleChange }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggleChange = (checked) => {
    setIsToggled(checked);
    if (onToggleChange) {
      onToggleChange(checked);
    }
  };

  return (
    <div className="form-footer-container">
      <div className="toggle-container">
        {showToggle && <Toggle title={toggleTitle} isToggled={isToggled}  onToggleChange={handleToggleChange}  />}
      </div>
      <div className="buttons-container">
        <button className='popup-form-cancel popup-form-buttons' type="button" onClick={onClose}>{cancelTitle}</button>
        <button className='popup-form-submit popup-form-buttons' type="submit" onClick={onSave}>{submitButton}</button>
      </div>
    </div>
  );
};

export default FormFooter;