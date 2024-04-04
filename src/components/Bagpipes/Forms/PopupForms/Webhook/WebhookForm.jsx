import React, { useState, useRef, useEffect } from 'react';
import CreateWebhookForm from './CreateWebhookForm';
import useAppStore from '../../../../../store/useAppStore';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';
import CollapsibleField from '../../fields/CollapsibleField';
import FormHeader from '../../FormHeader';
import FormFooter from '../../FormFooter';
import { useTippy } from '../../../../../contexts/tooltips/TippyContext';
import { WebhookIcon } from '../../../../Icons/icons';
import WebhooksService from '../../../../../services/WebhooksService';

import { Form } from 'react-router-dom';
import { Select } from 'antd';
import toast from 'react-hot-toast';
import '../Popup.scss';
import '../../fields/Fields.scss';
import '../../../../../index.css';



const WebhookForm = ({ onSubmit, onSave, onClose, onEdit, nodeId }) => {
  const { scenarios, activeScenarioId, saveNodeEventData, saveNodeFormData, saveWebhook, webhooks, setSelectedWebhookInNode } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveNodeEventData: state.saveNodeEventData,
    saveNodeFormData: state.saveNodeFormData,
    saveWebhook: state.saveWebhook,
    webhooks: state.webhooks,
    setSelectedWebhookInNode: state.setSelectedWebhookInNode,
   }));

  const selectedWebhook = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId)?.selectedWebhook || '';

  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const createFormRef = useRef();
  const { hideTippy, showTippy } = useTippy();

  const [isListening, setIsListening] = useState(false);
  const [eventReceived, setEventReceived] = useState(false);
  const pollingIntervalRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const currentScenario = scenarios[activeScenarioId];
    // Accessing the webhooks from the zustand store
  const scenario = scenarios[activeScenarioId];
  const node = scenario.diagramData.nodes.find(node => node.id === nodeId);
  const webhookNodes = currentScenario?.diagramData.nodes.filter(node => node.type === 'webhook');
  console.log('webhookNodes', webhookNodes);
  const selectedWebhookData = webhookNodes.find(webhook => webhook.selectedWebhook === selectedWebhook);
  const selectedWebhookObject = webhooks?.find(webhook => webhook.name === selectedWebhook);
  console.log('selectedWebhookObject outside:', selectedWebhookObject);
  const webhookURL = selectedWebhookObject ? `https://webhook.site/${selectedWebhookObject.uuid}` : '';
  

  // Callback function to handle new webhook data
  const handleNewWebhookData = (newWebhook) => {
    console.log('New webhook data:', newWebhook);
    // Use newWebhook.uuid directly since selectedWebhookObject might be undefined
    setSelectedWebhookInNode(activeScenarioId, nodeId, newWebhook.name, newWebhook.uuid);
    saveWebhook(newWebhook); // Save the new webhook globally
    saveNodeFormData(activeScenarioId, nodeId, { webhookName: newWebhook.name, uuid: newWebhook.uuid});
  
    // Force component to re-render if necessary
    setForceUpdate(prev => !prev);
    setCreateFormVisible(false);
  };
  
  
  const handleCreateClick = () => {
    setCreateFormVisible(true);
  };

  const handleSave = (newWebhook) => {
    // event.preventDefault();

    // update this to be similar to handleNewWebhookData
    setCreateFormVisible(false);
    onSave(newWebhook);
    hideTippy();

  };

  const handleCancel = () => {
    onClose(); // Invoke the onClose function passed from the parent component
    hideTippy();
  };


  const handleCloseCreateForm = () => {
    setCreateFormVisible(false);
  };

  const handleEditWebhook = () => {
    if (!selectedWebhook) {
      alert('Please select a webhook to edit.');
      return;
    }
    // Find the selected webhook object
    const webhookToEdit = webhooks.find(webhook => webhook.name === selectedWebhook);
    if (webhookToEdit) {
      // Logic to open CreateWebhookForm with pre-filled data
      // You might need to modify CreateWebhookForm to accept initial data for editing
    }
  };

  const fetchAndProcessEvents = async () => {
    console.log('Fetching webhook events... uuid:', selectedWebhookObject.uuid);  
    const data = await WebhooksService.fetchLatestFromWebhookSite(selectedWebhookObject.uuid);
    if (data && data.data.length > 0) {
      console.log('Webhook event received:', data.data);
      toast.success('Webhook event received');
  
      const webhookEvent = data.data[0];
      // Attempt to parse the content field if it exists and is a JSON string
      let parsedContent = null;
      try {
        parsedContent = webhookEvent.content ? JSON.parse(webhookEvent.content) : null;
      } catch (error) {
        console.error('Error parsing webhook event content:', error);
      }
      // const formData = {
      //   uuid: webhookEvent.query,
      // }
  
      const eventData = {
        query: webhookEvent.query,
        content: webhookEvent.request || parsedContent, // Use request or parsed content
        headers: webhookEvent.headers, 
        createdAt: webhookEvent.created_at,
        method: webhookEvent.method,
      };

      // Save the updated formData in the node
      saveNodeEventData(activeScenarioId, nodeId, eventData);
      
      setEventReceived(true);
      stopListening();
    }
  };

  const startListening = () => {
    console.log('Starting to listen for webhook events...');
    if (!pollingIntervalRef.current && !eventReceived) {
      console.log('Starting to listen for webhook events in if...');
      fetchAndProcessEvents(); 
      pollingIntervalRef.current = setInterval(fetchAndProcessEvents, 5000); // Poll every 5 seconds
    }
  };

  const stopListening = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsListening(false); // Update the listening state
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
    setIsListening(!isListening);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(webhookURL)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        // This function is called if there was an error copying
        toast.error('Failed to copy!');
      });
  };

  useEffect(() => {
    if (copied) {
      toast.success('Copied to clipboard!');
    }
  }, [copied]);

  useEffect(() => {
    // Perform actions based on the updated selectedWebhook
    const selectedWebhookName = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId)?.selectedWebhook;
    if (selectedWebhookName) {
      // Actions like updating the UI, fetching related data, etc.
    }
  }, [scenarios, activeScenarioId, nodeId]);

  return (
    <div>

    {isCreateFormVisible && (
      <div className='relative'>
        <Tippy
          appendTo={() => document.body}

          content={<CreateWebhookForm onSave={handleNewWebhookData} onClose={handleCancel} />}
          interactive={true}
          theme='light'
          placement='auto'
          visible={isCreateFormVisible}
          // hideOnClick={false}
          reference={createFormRef}
        
        >
          <div ref={createFormRef}></div>
        </Tippy>
        </div>
      )}


      <FormHeader onClose={handleCancel} title='Webhook' />  
      <form className='popup-form' onSubmit={onSubmit}>
      <div>
      <div className="webhook-container">
      <WebhookIcon className='h-4 w-4' fillColor='black' />
      <Select
        value={selectedWebhook}
        getPopupContainer={trigger => trigger.parentNode}

        onChange={value => setSelectedWebhookInNode(activeScenarioId, nodeId, value)}
        className='webhook-selector w-full font-semibold custom-select' placeholder="Select a webhook">
        {webhooks?.map((webhook, index) => (
          <Select.Option key={index} value={webhook.name}>{webhook.name}</Select.Option>
        ))}
      </Select>

        <button className='popup-form-create' onClick={handleCreateClick}>Create</button>
      </div>
        <div className="description ">Here be the generated webhook. Bagpies is listening for the data and will determine the data structure from the incoming data automatically. Please send your data sample to the webhook url provided below.</div>

        <div className="description ">
        { selectedWebhook && selectedWebhookData && 
        <div className='flex mt-2 mb-2  '> 
        <button className='webhook-url' onClick={handleCopyToClipboard}>
          {webhookURL}</button>
        <button
          className='popup-form-buttons copy-button' 
          onClick={handleCopyToClipboard}

        >copy</button>

        </div>
        }
      </div>
    </div>
  </form>
      

      <div className="event-listening-area">
        <button className='popup-form-buttons border border-gray-400 rounded'onClick={toggleListening}>
          {isListening ? (
            <>
              <div className="small-spinner"></div>
              Stop
            </>
          ) : (
            "Start Listening"
          )}
        </button>
      </div>
    
      <FormFooter onClose={handleCancel} onSave={handleSave} showToggle={false} />
    </div>
  );
};

export default WebhookForm;
