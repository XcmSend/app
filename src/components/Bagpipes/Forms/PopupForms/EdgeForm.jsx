import React, { useState } from 'react';
import CollapsibleField from '../fields/CollapsibleField'; // Import your existing CollapsibleField component
import FormHeader from '../FormHeader';
import FormFooter from '../FormFooter';
import { EdgeIcon } from '../../../Icons/icons';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';
import useAppStore from '../../../../store/useAppStore';
import './Popup.scss';  


// Define operator options
const operatorOptions = [
  { value: 'exists', label: 'Exists' },
  { value: 'not_exists', label: 'Does not exist' },
  { value: 'equal', label: 'Equal to' },
  { value: 'not_equal', label: 'Not equal to' },
  { value: 'contains', label: 'Contains' },
  // Add other operators as needed
];


const EdgeForm = ({ edge, onSave, onClose }) => {
  const { scenarios, activeScenarioId, saveEdgeFormData } = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveEdgeFormData: state.saveEdgeFormData,
  }));
  const edgeId = edge.id;
  const formData = scenarios[activeScenarioId]?.diagramData?.edges.find(edge => edge.id === edgeId)?.formData || {};
  const initialConditions = formData.conditions || [{ value: '', operator: '', anotherValue: '' }];
  const [filterCondition, setFilterCondition] = useState(initialConditions);

  const handleSave = () => {
    const data = {
      label: edge.label,
      conditions: filterCondition,
    };
    onSave(data);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleScroll = (e) => {
    e.stopPropagation();
  };


  const handleConditionChange = (newConditions) => {
    console.log('EdgeForm newConditions', newConditions);

    const updatedValues = { ...formData, conditions: newConditions };
    setFilterCondition(newConditions);
    saveEdgeFormData(activeScenarioId, edgeId, updatedValues);
  };

  return (
    <div onScroll={handleScroll} className="edge-form-container">
      <FormHeader onClose={handleCancel} title={`Edge Filter (${edgeId})`} logo={<EdgeIcon className="h-4 w-4" fillColor="black" />} />

      <div className='standard-form'>        
      <label>
          Label:
          <input name="label" defaultValue={edge.label} />
        </label>
        <CollapsibleField
          fieldKey="condition"
          title="Condition"
          fieldTypes="condition"
          value={Array.isArray(formData.conditions) ? formData.conditions : initialConditions}
          selectOptions={operatorOptions}
          onChange={handleConditionChange}
          edgeId={edgeId}
        />
      </div>

      <FormFooter onClose={handleCancel} onSave={handleSave} showToggle={false} />
    </div>
  );
};

export default EdgeForm;