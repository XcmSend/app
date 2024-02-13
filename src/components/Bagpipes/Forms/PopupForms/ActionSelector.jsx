import React, { useState } from 'react';
import { Select } from 'antd';
import actions from '../../CustomNodes/ActionNode/actions'; 
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
import '../../Forms/PopupForms/Popup.scss';

const { Option } = Select;

const AntdSelector = () => {
  const [selectedAction, setSelectedAction] = useState('');

  const handleDropdownClick = value => {
    console.log("[handleDropdownClick] Selected value:", value);
    setSelectedAction(value);

    // Additional logic based on the selected action
    // e.g., updating the state, making API calls, etc.
  };

  const selectedActionData = actions.find(action => action.name === selectedAction);

  return (
    <Select
      className="action-selector"
      placeholder="Select an action"
      value={selectedAction}
      onChange={handleDropdownClick}
      dropdownRender={menu => (
        <React.Fragment>
          {menu}
          {/* Additional custom content can be added here if needed */}
        </React.Fragment>
      )}
    >
    

      {/* Dynamically rendered options */}
      {actions.map(action => (
        <Option className='p-2 w-24' key={action.name} value={action.name}>
          <div className="flex jusify-between items-center ">
            {action.logo && <img src={action.logo} alt={action.name} className="mr-2 w-5 h-5 align-center" />}
            <div>{action.name}</div>

            {action.information && (
              <Tippy content={action.information} interactive={true} theme='light' placement='auto' appendTo={() => document.body}>
                <span className=' ml-1 mb-2 bg-blue-100 hover:bg-blue-200 p-1 rounded-full shadow-md cursor-pointer flex items-center justify-center w-3 h-3'>
                  <img src="./iIcon.svg" alt="Info" className='w-1 h-1'  />
                </span>
              </Tippy>
            )}
          </div>
        </Option>
      ))}
    </Select>
  );
};

export default AntdSelector;
