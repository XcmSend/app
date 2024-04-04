import React from 'react';
import useAppStore from '../../../../store/useAppStore';
import FormHeader from '../../Forms/FormHeader';
import { useTippy } from '../../../../contexts/tooltips/TippyContext';


const DecisionPrompt = ({ nodeId, onClose }) => {
  const setWebhookUserDecision = useAppStore(state => state.setWebhookUserDecision);
  const setWebhookDecisionPending = useAppStore(state => state.setWebhookDecisionPending);
  const { hideTippy } = useTippy();

  const handleProcessNow = () => {
    setWebhookUserDecision('processNow', nodeId);
    setWebhookDecisionPending(false, nodeId); // Make sure to include the nodeId
    onClose(); // Close the prompt
    hideTippy(); // Ensure this method properly hides the prompt visually
  };

  const handleWaitForNew = () => {
    setWebhookUserDecision('waitForNew', nodeId);
    setWebhookDecisionPending(false, nodeId); // Include the nodeId
    onClose(); // Close the prompt
    hideTippy(); // Ensure this method hides the prompt visually
  };

  const handleCancel = () => {
    onClose(); // Invoke the onClose function passed from the parent component
    hideTippy();
  };

  return (
    <div>
        <FormHeader onClose={handleCancel} title='Unprocessed Webhook Events' />  
            <div className='p-3'>
                <p>Do you want to process the existing event or wait for a new one?</p>
                <div className='flex justify-center items-center'>
                <button className="bg-blue-500 text-white mr-2"onClick={handleProcessNow}>Process Existing</button>
                <button className="bg-blue-500 text-white" onClick={handleWaitForNew}>Wait for New</button>
                </div>
            </div>
    </div>
  );
};

export default DecisionPrompt;
