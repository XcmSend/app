import React, { useState, useRef, useEffect } from 'react';
// import CreateHttpForm from './CreateHttpForm';
import useAppStore from '../../../../../store/useAppStore';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/themes/light.css';
import { CollapsibleField, ItemField }  from '../../fields';
import FormHeader from '../../FormHeader';
import FormFooter from '../../FormFooter';
import { Form } from 'react-router-dom';
import { Select, Input } from 'antd';
import toast from 'react-hot-toast';
import '../Popup.scss';
import '../../../../../index.css';
import { HttpIcon } from '../../../../Icons/icons';
// import HttpsService from '../../../../../services/HttpsService';



const HttpForm = ({ onSubmit, onSave, onClose, onEdit, nodeId }) => {
  const { scenarios, activeScenarioId, saveNodeFormData } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveNodeFormData: state.saveNodeFormData,

   
   }));

   const selectedHttp = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId)?.selectedHttp || '';

  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const createFormRef = useRef();

  const [isListening, setIsListening] = useState(false);
  const [eventReceived, setEventReceived] = useState(false);
  const pollingIntervalRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const currentScenario = scenarios[activeScenarioId];
    // Accessing the https from the zustand store
    const scenario = scenarios[activeScenarioId];
  const node = scenario.diagramData.nodes.find(node => node.id === nodeId);
  const httpNodes = currentScenario?.diagramData.nodes.filter(node => node.type === 'http');
  console.log('httpNodes', httpNodes);

  const [bodyType, setBodyType] = useState('empty');
  const [contentType, setContentType] = useState('text');
  const [customContentType, setCustomContentType] = useState('');
  const [requestContent, setRequestContent] = useState('');
  const [isAdvancedSettings, setIsAdvancedSettings] = useState(false);

  const handleBodyTypeChange = (value) => setBodyType(value);
  const handleContentTypeChange = (value) => setContentType(value);
  const handleCustomContentTypeChange = (e) => setCustomContentType(e.target.value);
  const handleRequestContentChange = (e) => setRequestContent(e.target.value);
  const handleAdvancedSettingsToggle = (value) => setIsAdvancedSettings(value);

//   const selectedHttpObject = https?.find(http => http.name === selectedHttp);
//   const httpURL = selectedHttpObject ? `https://http.site/${selectedHttpObject.uuid}` : '';
  

  // Callback function to handle new http data
  const handleNewHttpData = (newHttp) => {

    console.log('newHttp nodeId', nodeId);
    // Fetch the current https for the node

    setSelectedHttpInNode(activeScenarioId, nodeId, newHttp.name);

    console.log('selectedHttp', selectedHttp )

    // Save updated data
    saveHttp(newHttp); // Save the http globally

    // Force component to re-render if necessary
    setForceUpdate(prev => !prev);
    setCreateFormVisible(false);
};
  




  const handleCreateClick = () => {
    setCreateFormVisible(true);
  };

  const handleSave = (newHttp) => {
    // event.preventDefault();

    // update this to be similar to handleNewHttpData
    setCreateFormVisible(false);
    onSave();
  };

  const handleCancel = () => {
    onClose(); // Invoke the onClose function passed from the parent component
};

  const handleCloseCreateForm = () => {
    setCreateFormVisible(false);
  };



  const fetchAndProcessEvents = async () => {
    const data = await HttpsService.fetchLatestFromHttpSite(selectedHttpObject.uuid);
    if (data && data.data.length > 0) {
      console.log('Http event received:', data.data);
      toast.success('Http event received');

      const httpEvent = data.data[0];
      const eventData = {
        query: httpEvent.query,
        createdAt: httpEvent.created_at,
        method: httpEvent.method,
      };

      // save the http object (including event data) in the zustand store
      const updatedHttp = { ...selectedHttpObject, eventData };
      saveHttp(updatedHttp);   
      setEventReceived(true);
      stopListening();
    }
  };

  const startListening = () => {
    if (!pollingIntervalRef.current && !eventReceived) {
      fetchAndProcessEvents(); // Fetch immediately
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
    navigator.clipboard.writeText(httpURL)
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
    // Perform actions based on the updated selectedHttp
    const selectedHttpName = scenarios[activeScenarioId]?.diagramData.nodes.find(node => node.id === nodeId)?.selectedHttp;
    if (selectedHttpName) {
      // Actions like updating the UI, fetching related data, etc.
    }
  }, [scenarios, activeScenarioId, nodeId]);

  return (
    <div className='http-form'>

    {isCreateFormVisible && (
      <div className='relative'>
        <Tippy
        content={<CreateHttpForm onSave={handleNewHttpData} onClose={handleCloseCreateForm} />
      }
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


      <FormHeader title='Http' logo={<HttpIcon className='h4 w-4' fillColor='black' />} />  
    

   



        <CollapsibleField title="URL" info="Enter a name for the webhook" hasToggle={false}>
        <Input placeholder="Enter URL"  className='border rounded border-gray-300 p-2 mb-2' /> 
        </CollapsibleField>
        <CollapsibleField 
            title="Method" 
            info="Select request method"
            toggleTitle="Map"
            hasToggle={true}
            selectOptions={[{ label: 'GET', value: 'get' }, { label: 'HEAD', value: 'head' }, { label: 'POST', value: 'post' }, { label: 'PUT', value: 'put' }, { label: 'PATCH', value: 'patch' }, { label: 'DELETE', value: 'delete' },{ label: 'OPTIONS', value: 'options' }]}

        />
          <CollapsibleField 
            title="Headers" 
            info="Add HTTP headers"
            toggleTitle="Map"
            hasToggle={true}

        />
        <CollapsibleField 
            title="Query" 
            info="Select query paramters"
            toggleTitle="Map"
            hasToggle={true}

        />
          <CollapsibleField 
            title="Body type" 
            info="Add HTTP headers"
            hasToggle={false}
            selectOptions={[{ label: 'Empty', value: 'empty' }, { label: 'Raw', value: 'raw' },{ label: 'Application/x-www-form-urlencoded', value: 'url-encoded' },{ label: 'Multipart/form-data', value: 'multipart-form' }]}
            onSelectionChange={handleBodyTypeChange}
        />

          {bodyType === 'raw' && (
          <>
            {/* Content Type Subfield */}
            <CollapsibleField 
              title="Content Type"
              hasToggle={false}
              selectOptions={[
                { label: 'Empty', value: 'empty' },
                { label: 'Text (text/plain)', value: 'text-plain' },
                { label: 'JSON (application/json)', value: 'app-json' },
                { label: 'XML (application/xml)', value: 'app-xml' },
                { label: 'XML (text/xml)', value: 'text-xml' },
                { label: 'HTML (text/html)', value: 'text-html' },
                { label: 'Custom', value: 'custom' },
              ]}
              onSelectionChange={handleContentTypeChange}
            />
            {contentType === 'custom' && (
                      <CollapsibleField title="Value" hasToggle={false} onChange={handleCustomContentTypeChange} >
                        <Input  className='border rounded border-gray-300 p-2 mb-2' /> 
                      </CollapsibleField>
            )}
            {/* Request Content sibling */}
            <CollapsibleField title="Request Content"  hasToggle={false} >
                        <Input  className='border rounded border-gray-300 p-2 mb-2' /> 
                      </CollapsibleField>          </>
        )}

      {bodyType === 'url-encoded' && (
          <>
            {/* Content Type Subfield */}
            <CollapsibleField 
              title="Fields"
              hasToggle={true}
              
            />
            </>
        )}

        {bodyType === 'multipart-form' && (
          <>
            {/* Content Type Subfield */}
            <CollapsibleField 
              title="Fields"
              hasToggle={true}
              
            />
            </>
        )}

        <CollapsibleField 
            title="Headers" 
            info="Add HTTP headers"
            toggleTitle="Map"
            hasToggle={true}
            selectOptions={[{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }]}

        />
        <CollapsibleField 
            title="Headers" 
            info="Add HTTP headers"
            toggleTitle="Map"
            hasToggle={true}
            selectOptions={[{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }]}

        />
        <CollapsibleField 
            title="Headers" 
            info="Add HTTP headers"
            toggleTitle="Map"
            hasToggle={true}
            selectOptions={[{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }]}
        />
  

    
      <FormFooter onClose={handleCancel} onSave={handleSave} showToggle={false} />
    </div>
  );
};

export default HttpForm;
