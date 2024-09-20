import React, { useState, useEffect, useContext } from 'react';
import { Select } from 'antd';
import './Blinks.scss';
import BlinkViewer from './BlinkViewer';
import useBlinkStore from '../../../store/useBlinkStore';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash'; 
import { Data } from '@polkadot/types';
import { WalletContext } from '../../../components/Wallet/contexts';



export type ActionType = "action" | "completed";

export interface Parameter {
  name: string;
  label: string;
  type?: string; // Ensure type is optional if it can be missing
}

export interface LinkedAction {
  label: string;
  href: string;
  type?: string;
  parameters: Parameter[];
}


interface ActionError {
  message: string;
}

export interface Action<T extends ActionType> {
  id: string;
  recipient: string; // Recipient address TODO - we can be more specific here
  type: T;
  icon: string;
  title: string;
  description: string;
  label: string;
  disabled?: boolean;
  actionType: string;
  links: {
    actions: LinkedAction[];
  };
  error?: ActionError;
}

export interface NewActionForm {
  label: string;
  amount: string;
  inputName: string;
  amountType: string; // "fixedAmount" or "inputAmount"
}

const BlinkBuilder: React.FC = () => {
  const walletContext = useContext(WalletContext);

  const { blinks, activeBlinksId, saveBlinkFormData, createNewBlink, getBlinkData, setActiveBlinksId  } = useBlinkStore(state => ({ 
    blinks: state.blinks,
    activeBlinksId: state.activeBlinksId,
    saveBlinkFormData: state.saveBlinkFormData,
    createNewBlink: state.createNewBlink,
    getBlinkData: state.getBlinkData,
    setActiveBlinksId: state.setActiveBlinksId
  }));


   // State initialization with default values moved into a function
   const initializeAction = (id: string) => ({
    id: id,
    type: "action",
    icon: "https://www.pcrf.net/cached_uploads/resize/670/670/2024/08/27/whatsapp-image-2024-08-27-at-00-20-45-1-1724740628-jpeg-1724740628.wm.jpeg",
    title: "",
    description: "",
    label: "",
    disabled: false,
    links: { actions: [] },
    error: undefined,
    actionType: 'select',
    recipient: ''
  });

let formData = getBlinkData(activeBlinksId);


  useEffect(() => {
    console.log('BlinkBuilder activeBlinksId', activeBlinksId);
    if (activeBlinksId) {

      formData = getBlinkData(activeBlinksId);
      console.log('BlinkBuilder already id loading formData',);

    
      if (formData) {
        console.log('BlinkBuilder formData', formData);
        setAction(formData);
        setActionForms(formData.links?.actions || []);
        setActionType(formData.actionType);
        // Set the amount types for each action in the array
        if (formData.links?.actions) {
          const actionTypes = formData.links.actions.map(action => action.type || ''); // Extract the types
          setAmountTypes(actionTypes); // Assume setAmountTypes manages multiple amount types
        }
      }
     
    
    } else {
      const newId = uuidv4();
      setActiveBlinksId(newId);
      const newBlinkData = initializeAction(newId) as Action<"action">;
      saveBlinkFormData(newId, newBlinkData);
      setAction(newBlinkData);
    }
  }, [activeBlinksId, createNewBlink, getBlinkData, setActiveBlinksId]);


  const [action, setAction] = useState<Action<"action">>({
    id: '',
    type: "action",
    icon: "https://www.pcrf.net/cached_uploads/resize/670/670/2024/08/27/whatsapp-image-2024-08-27-at-00-20-45-1-1724740628-jpeg-1724740628.wm.jpeg",    
    title: "",
    description: "",
    label: "",
    disabled: false,
    links: { actions: [] },
    error: undefined,
    actionType: 'select',
    recipient: ''
  });

  const [actionForms, setActionForms] = useState<NewActionForm[]>([]);
  const [actionType, setActionType] = useState<string>("select");
  const [amountTypes, setAmountTypes] = useState<string[]>([]); 


    
   // Debounced save function to avoid frequent updates and potential race conditions
   const saveData = debounce(() => {
    if (activeBlinksId && action) {
      saveBlinkFormData(activeBlinksId, action);
    }
  }, 2000);

  useEffect(() => {
    saveData();
    return () => saveData.cancel(); // Cleanup to cancel the debounced call
  }, [action, saveData]);

  const handleChange = (field: keyof Action<"action">) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAction(prev => ({ ...prev, [field]: e.target.value }));
    console.log('action', action);
  };

  const handleActionFormChange = (index: number, valueOrEvent: any, field: keyof NewActionForm) => {
    let value: string;
    if (typeof valueOrEvent === 'string') {
        // This is directly from Select component
        value = valueOrEvent;
    } else if (valueOrEvent && valueOrEvent.target) {
        // This is from standard HTML input elements
        value = valueOrEvent.target.value;
    } else {
        // If neither, log an error or handle the case appropriately
        console.error('Invalid input from form elements');
        return;
    }

    

    const newForms = [...actionForms];
    newForms[index][field] = value;
    setActionForms(newForms);

    // Update main action state to reflect changes
    const updatedActions = newForms.map(form => ({
        label: form.label,
        href: form.amountType === "fixedAmount" ? `/api/${actionType}/recipient?amount=${form.amount}` : `/api/${actionType}/recipient`,
        type: form.amountType,
        parameters: form.amountType === "inputAmount" ? [{ name: form.inputName, label: form.label, type: 'inputAmount' }] : []
    }));
    setAction(prev => ({ ...prev, links: { actions: updatedActions } }));
  };

  const addNewActionForm = () => {
    if (actionType !== "" && actionType !== "no action") {
        const inputAmountCount = actionForms.filter(form => form.amountType === "inputAmount").length;
        const fixedAmountCount = actionForms.filter(form => form.amountType === "fixedAmount").length;

        if (inputAmountCount >= 1 && fixedAmountCount >= 3) {
            alert("Maximum number of input and fixed amounts reached.");
            return;
        }

        setActionForms(prev => [...prev, { label: "", amount: "", inputName: "", amountType: "", recipient: "" }]);
    } else {
        alert("Please select a valid action type first.");
    }
  };


  const removeActionForm = (index: number) => {
    const filteredForms = actionForms.filter((_, idx) => idx !== index);
    setActionForms(filteredForms);

    // Update the main action state to reflect this change
    const updatedActions = filteredForms.map(form => ({
        label: form.label,
        href: form.amountType === "fixedAmount" ? `/api/${actionType}/recipient?amount=${form.amount}` : `/api/${actionType}/recipient`,
        parameters: form.amountType === "inputAmount" ? [{ name: form.inputName, label: form.label }] : []
    }));
    setAction(prev => ({ ...prev, links: { actions: updatedActions } }));
  };

  const handleActionTypeChange = (value: string) => {
    // Set the new action type
    setActionType(value);

    // If changing action type to something valid, reset forms and add one default form
    if (value !== "no action") {
        setActionForms([{ label: "", amount: "", inputName: "", amountType: "" }]);
        // Update the main action object
        setAction(prev => ({
            ...prev,
            actionType: value,
            links: { actions: [] } // Clear existing actions
        }));
    } else {
        // If "no action" is selected, clear all forms
        setActionForms([]);
        setAction(prev => ({
            ...prev,
            actionType: value,
            links: { actions: [] }
        }));
    }
};


const handleAddressChange = (newAddress) => {
  // Update formData with the new address
  saveBlinkFormData(activeBlinksId, {...formData, selectedAddress: newAddress});
};



const renderAddressSelection = () => {
  if (!walletContext || walletContext.accounts.length === 0) {
    return <div>No wallet accounts available.</div>;
  }

  const addressOptions = walletContext.accounts.map(acc => ({
    label: `${acc.name} (${acc.address})`, // Adjust formatting as needed
    value: acc.address
  }));

  

  const renderCustomContent = () => {
    

    return (

    <div className="flex items-center primary-font">
    {isFetchingBalance ? (
      <span>Loading balance...</span>
    ) : (
      balance && <BalanceTippy balance={balance} symbol={chainSymbol} /> // Adjust symbol accordingly
    )}
          <span onClick={fetchBalance} className="text-xs m-1 p-0 rounded refresh-button">
          <img className="h-3 w-3" src="/refresh.svg" />
        </span>
               
  </div>
    );
  };

  return (
    <CollapsibleField
      key="addressDropdown"
      title="Select Address"
      hasToggle={true}
      fieldTypes="select"
      customContent={renderCustomContent()}
      nodeId={nodeId}
      info="Select an address that will sign the transaction."
      selectOptions={addressOptions}
      value={formData.selectedAddress || ''}
      onChange={(value) => handleAddressChange(value)}
    />
  );
};






const renderChainSelection = () => {

  const renderCustomContent = () => {
    if (chains?.length === 0) {
        return <div>Loading chains...</div>;
    }
  }

    return (
        <CollapsibleField
            key="chainDropdown"
            title="Select Chain"
            hasToggle={true}
            customContent={renderCustomContent()
            }
            fieldTypes="select"
            nodeId={nodeId}
            info="Choose a blockchain chain to query"
            selectOptions={chains.map(chain => ({
              label: chain.display || chain.name,
              value: chain.name
            }))}
            value={formData.selectedChain}
            onChange={(newValue) => handleChainSelectChange(newValue)}  
            />
    );
};




  return (
    <>
     <div className='blinkHeader'>

<div className='blinkTitleInfo'> 
  <h1>Blinks Builder</h1>
  <span>Blink {activeBlinksId}</span></div>
</div>
    <div className='blinkMainContainer'>
     
      
      
      <div className='blinkBuilder'>
      
        {/* <button onClick={}><span>My Blinks</span></button> */}
        
        <form className='blinkForm' onSubmit={(e) => e.preventDefault()}>
          <label>
            Title:
            <input type="text" value={action.title} onChange={handleChange('title')} placeholder="Enter Title" />
          </label>
          <label>
            Icon (URL):
            <input type="text" value={action.icon} onChange={handleChange('icon')} placeholder="https://example.com/icon.png" />
          </label>
          <label>
            Description:
            <textarea value={action.description} onChange={handleChange('description')} placeholder="Brief description here." />
          </label>

          <div className='actionArea'>
          <label>
            Call To Action Type:
            <br></br>
            <Select
              className='actionSelect width-[100%]'
              value={actionType}
              onChange={handleActionTypeChange}
              placeholder="Select Action Type"
              style={{ width: 200 }}
              allowClear
            >
              <Select.Option value="select">Select a call to action</Select.Option>
              <Select.Option value="transfer">Transfer</Select.Option>
              <Select.Option value="stake">Stake</Select.Option>
              <Select.Option value="no action">No Action</Select.Option>
            </Select>
          </label>

          <input type="text" value={action.recipient} onChange={handleChange('recipient')} placeholder="The Recipient Address" />


          {actionType !== "no action" && actionForms.map((form, index) => (
            <div className='actionRow'>
            <div className='actionBox' key={index}><span className=''>Action {index + 1}</span>
              <Select
                className='actionSelect'
                value={form.amountType}
                onChange={value => handleActionFormChange(index, value, 'amountType')}
                placeholder="Select Amount Type"
                style={{ width: 200 }}
                allowClear
              >
                <Select.Option value="fixedAmount">Fixed Amount</Select.Option>
                <Select.Option value="inputAmount">Input Amount</Select.Option>
              </Select>

              {form.amountType === "fixedAmount" && (
                <div className='subField ml-2'>
                  <input type="text" value={form.label} onChange={(e) => handleActionFormChange(index, e, 'label')} placeholder="Label (e.g., Send 1 DOT)" />
                  <input type="number" value={form.amount} onChange={(e) => handleActionFormChange(index, e, 'amount')} placeholder="Amount" />
                </div>
                )}
                {form.amountType === "inputAmount" && (
                  <div className='subField ml-2'>
                    <input type="text" value={form.label} onChange={(e) => handleActionFormChange(index, e, 'label')} placeholder="Label (e.g., Stake)" />
                    <input type="text" value={form.inputName} onChange={(e) => handleActionFormChange(index, e, 'inputName')} placeholder="Name of the input (e.g., amount)" />
                  </div>
                )}
                <button className='action-button' onClick={() => removeActionForm(index)}>
            <div className='remove-button'>-</div>
        </button>
            </div>
            
        </div>
          ))}

          {actionType !== "no action" && 
          <button className='action-button' onClick={addNewActionForm}>
          <div className='add-button'>+</div>
          {/* <label>Add action</label> */}
      </button>
      
          
          }
          </div>
        </form>

      </div>

      <BlinkViewer action={action} />


    </div>

    </>
  );
};

export default BlinkBuilder;
