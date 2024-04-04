import React, { useState } from "react";
import WebhooksService from '../../../../../services/WebhooksService';
import CollapsibleField from "../../fields/CollapsibleField";
import Toggle from '../../Toggle';
import FormHeader from "../../FormHeader";
import FormFooter from "../../FormFooter";
import '../Popup.scss';


const CreateWebhookForm = ({ onSave, onClose }) => {
    const [webhookName, setWebhookName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("awaiting webhook uuid");
        const uuid = await WebhooksService.callCreateWebhookAPI(); // Call the async function to generate UUID
        console.log("createWebhook response", uuid);
        const newWebhook = {
            name: webhookName,
            uuid: uuid
        };
        console.log("CreateWebhookForm newWebhook", newWebhook);
        onSave(newWebhook); // Pass the complete webhook data back to the parent
    };
    
    const handleCancel = () => {
        onClose(); // Invoke the onClose function passed from the parent component
    };

    return (
        <form onSubmit={handleSubmit}>
        <FormHeader title='Create Webhook' />
        <CollapsibleField title="Webhook Name" info="Enter a name for the webhook">
            <input 
            className='border rounded border-gray-300 p-2 mb-2'
            type="text"
            placeholder="New Webhook 1"
            value={webhookName}
            onChange={(e) => setWebhookName(e.target.value)}
            />        
        </CollapsibleField>
        <FormFooter onClose={handleCancel} onSave={handleSubmit}  />
        </form>
    );
  };

  export default CreateWebhookForm;