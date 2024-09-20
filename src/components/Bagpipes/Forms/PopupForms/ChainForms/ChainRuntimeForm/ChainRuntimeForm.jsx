import React, { useState, useEffect, useMemo } from 'react';
import useAppStore from '../../../../../../store/useAppStore';
import { CollapsibleField } from '../../../fields';
import { ChainQueryIcon } from '../../../../../Icons/icons';
import { useTippy } from '../../../../../../contexts/tooltips/TippyContext';
import { listChains } from '../../../../../../Chains/ChainsInfo';

import { queryMetadata } from '../QueryMetadata';
import { parseMetadataRuntimeApis } from '../utils/parseMetadataRuntimeApis';
import { parseLookupTypes } from '../utils/parseMetadataTypes';
import { resolveKeyType } from '../utils/resolveKeyType';
import ChainRpcService from '../../../../../../services/ChainRpcService';
import ExtrinsicCountTester from './ExtrinsicCountTester'; // Import the ExtrinsicCountTester component

import FormHeader from '../../../FormHeader';
import FormFooter from '../../../FormFooter';

import { CopyBlock } from 'react-code-blocks';

import '../types';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

import '../ChainForm.scss';
import '../../Popup.scss';
import '../../../../../../index.css';

const ChainRuntimeForm = ({ onSubmit, onSave, onClose, onEdit, nodeId }) => {
  const { scenarios, activeScenarioId, saveNodeFormData } = useAppStore(state => ({
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveNodeFormData: state.saveNodeFormData,
  }));

  const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};
  console.log('ChainRuntimeForm formData:', formData);

  const [metadata, setMetadata] = useState(null);
  console.log('ChainRuntimeForm metadata:', metadata);

  const [runtimeApis, setRuntimeApis] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedChain, setSelectedChain] = useState(formData.selectedChain || '');
  const [selectedApi, setSelectedApi] = useState(formData.selectedApi || null);
  const [selectedMethod, setSelectedMethod] = useState(formData.selectedMethod || null);
  const [result, setResult] = useState('');

  const { hideTippy } = useTippy();
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isTextAreaValue, setIsTextAreaValue] = useState(false);

  const lookupTypes = useMemo(() => {
    const typesArray = metadata?.metadata?.V14?.lookup?.types;
    if (typesArray && Array.isArray(typesArray)) {
      const parsedTypes = parseLookupTypes(typesArray);
      return parsedTypes;
    }
    console.error("Metadata is not valid or types are not available");
    return {};
  }, [metadata]);

  useEffect(() => {
    if (!formData.selectedApi && runtimeApis.length > 0) {
      setSelectedApi(runtimeApis[0]); // Sets default on initial load only if no API is selected
    }
  }, [runtimeApis, formData.selectedApi]);

  const fetchChains = async () => {
    const chainsObject = listChains();
    if (chainsObject && Object.keys(chainsObject).length > 0) {
      const chainsArray = Object.keys(chainsObject).map(key => ({
        ...chainsObject[key],
        id: key
      }));
      setChains(chainsArray);
      console.log("Chains loaded:", chainsArray);
    } else {
      console.error('Chains list is not available:', chainsObject);
      setChains([]);
    }
  };

  useEffect(() => {
    fetchChains();
  }, []);

  useEffect(() => {
    if (metadata) {
      setRuntimeApis(parseMetadataRuntimeApis(metadata));
    } else if (selectedChain) {
      queryMetadata(selectedChain)
        .then(setMetadata)
        .catch(error => console.error('Error fetching metadata:', error));
    }
  }, [metadata, selectedChain]);

  useEffect(() => {
    if (metadata) {
      console.log('Metadata:', metadata)
      const parsedData = parseMetadataRuntimeApis(metadata);
      console.log('Lookup Parsed Data:', parsedData);
      setRuntimeApis(parsedData);
    }
  }, [metadata]);

  const handleChainSelectChange = async (chainName) => {
    if (chainName !== selectedChain) {
      setSelectedChain(chainName);
      setSelectedApi(null);
      setSelectedMethod(null);

      try {
        const metadata = await queryMetadata(chainName);
        setMetadata(metadata);
        const parsedRuntimeApis = parseMetadataRuntimeApis(metadata);
        setRuntimeApis(parsedRuntimeApis);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    }
    saveNodeFormData(activeScenarioId, nodeId, { ...formData, selectedChain: chainName, selectedMethod: null, selectedApi: null });
  };

  const handleApiChange = (apiName) => {
    const newApi = runtimeApis.find(api => api.name === apiName);
    if (newApi && newApi !== selectedApi) {
      setSelectedApi(newApi);
      setSelectedMethod(null);
    }
    saveNodeFormData(activeScenarioId, nodeId, { ...formData, selectedApi: apiName, selectedApiData: newApi, selectedMethod: null });
  };

  const handleMethodChange = (methodName) => {
    const newMethod = formData.selectedApiData?.methods.find(method => method.name === methodName);
    if (newMethod && newMethod !== selectedMethod) {
      setSelectedMethod(newMethod);
    }
    setSelectedMethod(newMethod);

    saveNodeFormData(activeScenarioId, nodeId, { ...formData, selectedMethod: newMethod });
  };

  const handleMethodFieldChange = (newFieldValue) => {
    const updatedValues = { ...formData, methodInput: newFieldValue };
    saveNodeFormData(activeScenarioId, nodeId, updatedValues);
  };

  const renderChainSelection = () => {
    if (chains?.length === 0) {
      return <div>Loading chains...</div>;
    }

    return (
      <CollapsibleField
        key="chainDropdown"
        title="Select Chain"
        hasToggle={true}
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

  const renderApiSelection = () => {
    if (!selectedChain || runtimeApis.length === 0) return null;

    return (
      <CollapsibleField
        key="apiDropdown"
        title="Select Runtime API"
        hasToggle={true}
        fieldTypes="select"
        nodeId={nodeId}
        info="Select a runtime API to explore"
        selectOptions={runtimeApis.map(api => ({ label: api.name, value: api.name }))}
        value={formData.selectedApi || ''}
        onChange={(value) => handleApiChange(value)}
      />
    );
  };

  const renderMethodSelection = () => {
    if (!formData.selectedApiData || formData.selectedApiData?.methods?.length === 0) return null;

    return (
      <CollapsibleField
        key="methodDropdown"
        title="Select Method"
        hasToggle={true}
        fieldTypes="select"
        nodeId={nodeId}
        info="Select a method to view details"
        selectOptions={formData.selectedApiData?.methods?.map(method => ({ label: method.name, value: method.name }))}
        value={formData?.selectedMethod?.name || ''}
        onChange={(value) => handleMethodChange(value)}
      />
    );
  };

  const renderMethodFields = () => {
    if (!formData.selectedMethod) {
      return <div>No selected method.</div>;
    }
    if (Object.keys(lookupTypes).length === 0) {
      return <div>Loading data or incomplete metadata...</div>;
    }

    const method = formData.selectedMethod;

    if (!method) {
      console.error('Invalid or incomplete method:', method);
      return <div>Method data is incomplete or missing.</div>;
    }

    return (
      <>
        {method.args.length > 0 ? (
          method.args.map((arg, index) => {
            return (
                <CollapsibleField
                  key={`arg-${index}`}
                  title={`Enter ${arg.name} <${arg.type}>`}
                  info={`Type: ${arg.type}`}
                  hasToggle={false}
                  fieldTypes="input"
                  nodeId={nodeId}
                  value={formData.methodInput?.[arg.name] || ''}
                  onChange={(value) => handleMethodFieldChange({ ...formData.methodInput, [arg.name]: value })}
                  placeholder={`Enter ${arg.name}`}
                />
              );
            })
          ) : (
            <div>No arguments required for this method.</div>
          )}
          </>
        );
      };
    
      const handleRunMethodClick = async () => {
        setIsTextAreaValue(true);
    
        if (!selectedMethod) return;
    
        const lastExecutionId = useAppStore.getState().executionId;
        const recentExecutions = useAppStore.getState().scenarios[activeScenarioId]?.executions;
        const lastExecution = recentExecutions[lastExecutionId];
        console.log('Active Execution Data:', lastExecution);
    
        const diagramData = scenarios[activeScenarioId]?.diagramData;
        const orderedList = getOrderedList(diagramData.edges);
    
        try {
          const upstreamNodeIds = getUpstreamNodeIds(orderedList, nodeId);
          const parsedFormData = processAndSanitizeFormData(formData, lastExecution, upstreamNodeIds);
    
          const output = await ChainRpcService.executeRuntimeApiMethod({
            chainKey: parsedFormData.selectedChain,
            apiName: parsedFormData.selectedApi,
            methodName: parsedFormData.selectedMethod.name,
            params: parsedFormData.methodInput,
            atBlock: parsedFormData.blockHash || undefined
          });
          setResult(JSON.stringify(output, null, 2));
        } catch (error) {
          console.error('Execution failed:', error);
          setResult(`Error: ${error.message}`);
        }
      };
    
      const renderRunMethod = () => {
        if (!formData.selectedMethod) {
          return null;
        }
        return (
          <CollapsibleField
            title={`Run Runtime API Method`}
            info={'Query the runtime API within this node.'}
            fieldTypes="buttonTextArea"
            nodeId={nodeId}
            buttonName={'Run Method'}
            value={result}
            isTextAreaValue={isTextAreaValue}
            onClick={handleRunMethodClick}
            placeholder={`Enter`}
            disabled={!formData.selectedMethod}
          />
        );
      };
    
      const handleAdvancedSettingsToggle = (isToggled) => {
        setShowAdvancedSettings(isToggled);
      };
    
      const handleSave = () => {
        hideTippy();
        onSave();
      };
    
      const handleCancel = () => {
        hideTippy();
        onClose(); // Invoke the onClose function passed from the parent component
      };
    
      const handleScroll = (e) => {
        e.stopPropagation();
      };
    
      return (
        <div onScroll={handleScroll} className=''>
          <FormHeader onClose={handleCancel} title={`Runtime API Form (${nodeId})`} logo={<ChainQueryIcon className='h-4 w-4' fillColor='black' />} />
    
          <div className='standard-form'>
            {renderChainSelection()}
            {renderApiSelection()}
            {renderMethodSelection()}
            {renderMethodFields()}
            {renderRunMethod()}
            <ExtrinsicCountTester chainKey='polkadot' />
          </div>
    
          <FormFooter onClose={handleCancel} onSave={handleSave} showToggle={true} onToggleChange={handleAdvancedSettingsToggle} />
        </div>
      );
    };
    
    export default ChainRuntimeForm;

