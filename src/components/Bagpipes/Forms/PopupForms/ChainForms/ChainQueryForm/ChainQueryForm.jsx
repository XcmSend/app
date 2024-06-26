import React, { useState, useEffect, useMemo } from 'react';
import useAppStore from '../../../../../../store/useAppStore';
import { CollapsibleField }  from '../../../fields';
import { ChainQueryIcon } from '../../../../../Icons/icons';
import { useTippy } from '../../../../../../contexts/tooltips/TippyContext';
import { listChains} from '../../../../../../Chains/ChainsInfo';

import { processScenarioData, validateDiagramData, processAndSanitizeFormData, getUpstreamNodeIds } from '../../../../utils/scenarioUtils';
import { getOrderedList } from '../../../../hooks/utils/scenarioExecutionUtils';


import { queryMetadata } from './QueryMetadata';
import { parseMetadataPallets } from '../parseMetadata'
import { parseLookupTypes } from '../ParseMetadataTypes';
import { resolveKeyType } from '../resolveKeyType';
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



const ChainQueryForm = ({ onSubmit, onSave, onClose, onEdit, nodeId }) => {
  const { scenarios, activeScenarioId, saveNodeFormData } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveNodeFormData: state.saveNodeFormData,
   }));

  const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};
  console.log('ChainQueryForm formData:', formData);

  const [metadata, setMetadata] = useState(null); 
  console.log('ChainQueryForm metadata:', metadata);

  const [pallets, setPallets] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedChain, setSelectedChain] = useState(formData.selectedChain || '');
  const [selectedPallet, setSelectedPallet] = useState(formData.selectedPallet || null);
  const [selectedMethod, setSelectedMethod] = useState(formData.selectedMethod || null);
  const [blockHash, setBlockHash] = useState(formData.blockHash || '');
  const [result, setResult] = useState('');

  const { hideTippy } = useTippy();
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isTextAreaValue, setIsTextAreaValue] = useState(false);

  const lookupTypes = useMemo(() => {
    const typesArray = metadata?.metadata?.V14?.lookup?.types;
    // console.log('Lookup Types in lookupTypes:', typesArray);
    if (typesArray && Array.isArray(typesArray)) {
        const parsedTypes = parseLookupTypes(typesArray);
        // console.log("Lookup Parsed Types:", parsedTypes);
        return parsedTypes;
    }
    console.error("Metadata is not valid or types are not available");
    return {};
  }, [metadata]);


  useEffect(() => {
    if (!formData.selectedPallet && pallets.length > 0) {
      setSelectedPallet(pallets[0]); // Sets default on initial load only if no pallet is selected
    }
  }, [pallets, formData.selectedPallet]); 

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
      setPallets(parseMetadataPallets(metadata));
    } else if (selectedChain) {
      queryMetadata(selectedChain)
        .then(setMetadata)
        .catch(error => console.error('Error fetching metadata:', error));
    }
  }, [metadata, selectedChain]);

  useEffect(() => {
    if (metadata) {
      console.log('Metadata:', metadata)
      const parsedData = parseMetadataPallets(metadata);
      console.log('Lookup Parsed Data:', parsedData);  
      setPallets(parsedData);
    }
  }, [metadata]);


  const handleChainSelectChange = async (chainName) => {
    if (chainName !== selectedChain) {
        setSelectedChain(chainName);
        setSelectedPallet(null);
        setSelectedMethod(null);
        setBlockHash('');

        try {
            const metadata = await queryMetadata(chainName);
            setMetadata(metadata);
            const parsedPallets = parseMetadataPallets(metadata);
            setPallets(parsedPallets);
        } catch (error) {
            console.error('Error fetching metadata:', error);
        }
    }
    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedChain: chainName, selectedMethod: null, selectedPallet: null, blockHash: '', methodInput: null});
  };

    
  const handlePalletChange = (palletName) => {
    const newPallet = pallets.find(p => p.name === palletName);
    if (newPallet && newPallet !== selectedPallet) {
        setSelectedPallet(newPallet);
        setSelectedMethod(null); 
    }
    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedPallet: palletName, selectedPalletData: newPallet, selectedMethod: null, methodInput: null});
  };

  const handleMethodChange = (methodName) => {
    const newMethod = formData.selectedPalletData?.storage.find(storage => storage.name === methodName);
    console.log('handleMethodChange New Method:', newMethod);
    if (newMethod && newMethod !== selectedMethod) {
        setSelectedMethod(newMethod);
    }
    setSelectedMethod(newMethod);

    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedMethod: newMethod, methodInput: null});
  };


  const handleBlockHashChange = (newBlockHash) => {
    setBlockHash(newBlockHash);
    saveNodeFormData(activeScenarioId, nodeId, {...formData, blockHash: newBlockHash});
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

    
  const renderPalletSelection = () => {
    // console.log('renderPalletSelection pallets:', pallets);
    if (!selectedChain || pallets.length === 0) return null;
  
    return (
      <CollapsibleField
        key="palletDropdown"
        title="Select Pallet"
        hasToggle={true}
        fieldTypes="select"
        nodeId={nodeId}
        info="Select a pallet to explore"
        selectOptions={pallets.map(pallet => ({ label: pallet.name, value: pallet.name }))}
        value={formData.selectedPallet || ''}
        onChange={(value) => handlePalletChange(value)}
      />
    );
  };
    
  const renderMethodSelection = () => {
    if (!formData.selectedPalletData || formData.selectedPalletData?.storage?.length === 0) return null;
  
    return (
      <CollapsibleField
        key="methodDropdown"
        title="Select Method"
        hasToggle={true}
        fieldTypes="select"
        nodeId={nodeId}
        info="Select a method to view details"

        selectOptions={formData.selectedPalletData?.storage?.map(storageItem => ({ label: storageItem.name, value: storageItem.name }))}
        value={formData?.selectedMethod?.name || ''}
        onChange={(value) => handleMethodChange(value)}
      />
    );
  };

  const renderBlockHashInput = () => {
    if (!selectedMethod) return null; 
    
    return (
        <CollapsibleField
            title="Blockhash/Blocknumber to Query (optional)"
            info="Enter a block hash or block number to query specific data, leave blank for latest block."
            fieldTypes="input"
            hasToggle={true}
            nodeId={nodeId}
            value={formData?.blockHash || ''}
            onChange={(value) => handleBlockHashChange(value)}

        />
    );
  };


  const renderMethodFields = () => {
    if (!formData.selectedMethod) {
        return <div>No selected storage item.</div>;
    }
    if (Object.keys(lookupTypes).length === 0) {
        return <div>Loading data or incomplete metadata...</div>;
    }

    const storageItem = formData.selectedMethod; 

    if (!storageItem) {
      console.error('Invalid or incomplete storage item:', storageItem);
      return <div>Storage item data is incomplete or missing.</div>;
  }

    let keyTypeInfo = { displayName: 'Unknown' };
    if (storageItem.type?.Map) {
        const keyField = storageItem.type.Map.key;
        keyTypeInfo = resolveKeyType(keyField, lookupTypes);
    } else if (storageItem.type?.Plain) {
        keyTypeInfo = resolveKeyType(storageItem.type.Plain, lookupTypes);
    }


    return (
    <>
    {storageItem.type?.Map && (
     
            <CollapsibleField
                // key={key}
                title={`Enter Key <${keyTypeInfo.displayName}>`}
                info={storageItem.docs}
                hasToggle={true}
                fieldTypes="input"
                nodeId={nodeId}
                value={formData.methodInput || ''}
                onChange={(value) => handleMethodFieldChange( value)}
                placeholder={`${keyTypeInfo.path[keyTypeInfo.path.length - 1]}`}
                // onPillsChange={(updatedPills) => handlePillsChange(updatedPills, 'methodInput')}

            />
     
    )}
      {!storageItem.type?.Map && (
   
           <CollapsibleField
                // key={key}

                title={`Details for ${storageItem.name} <No Input Required>`}
                info={`${storageItem.docs}`}
                // fieldTypes="input"
                nodeId="key-input"
                />
   
    )}
</>
)
  };

  const renderRunMethod = () => {
    
    if (!formData.selectedMethod) {
        return null;
    }
      return (
        <CollapsibleField
        title={`Run Query Method`}
        info={'Query the storage within this node. '}
        fieldTypes="buttonTextArea"
        nodeId={nodeId}
        buttonName={'Run Method'}
        value={result}
        isTextAreaValue={isTextAreaValue}
        onClick={handleRunMethodClick}
        // onPillsChange={(updatedPills) => handlePillsChange(updatedPills, field.name)}
        placeholder={`Enter`}
        disabled={!formData.selectedMethod}
    />
      );
  };
    
  
 

  const handleRunMethodClick = async () => {
    setIsTextAreaValue(true);

    if (!selectedMethod) return;

    const lastExecutionId = useAppStore.getState().executionId;
    const recentExecutions = useAppStore.getState().scenarios[activeScenarioId]?.executions
    const lastExecution = recentExecutions[lastExecutionId];
    console.log('Active Execution Data:', lastExecution);

    const diagramData = scenarios[activeScenarioId]?.diagramData;
    const orderedList = getOrderedList(diagramData.edges);



    try {
      const upstreamNodeIds = getUpstreamNodeIds(orderedList, nodeId);
      const parsedFormData = processAndSanitizeFormData(formData, lastExecution, upstreamNodeIds);


        const output = await ChainRpcService.executeChainQueryMethod({
            chainKey: parsedFormData.selectedChain,
            palletName: parsedFormData.selectedPallet,
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

  const handlePillsChange = (updatedPills, fieldKey) => {
      saveNodeFormData(activeScenarioId, nodeId, (previousData) => ({
      ...previousData,
      [fieldKey]: updatedPills  // assuming pills directly relate to the field without a nested structure
    }));
  };

  const handleAdvancedSettingsToggle = (isToggled) => {
    setShowAdvancedSettings(isToggled);
  };
  
  const handleSave = (newChainQuery) => {
    // event.preventDefault();

    // update this to be similar to handleNewChainQueryData
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
      <FormHeader onClose={handleCancel} title={`Query Chain Form (${nodeId})`} logo={<ChainQueryIcon className='h-4 w-4' fillColor='black' />} />  

      <div className='http-form'>
          {renderChainSelection()}
          {renderPalletSelection()}
          {renderMethodSelection()}
          {renderMethodFields()}
          {renderRunMethod()}
            <ExtrinsicCountTester chainKey='polkadot' />
          {renderBlockHashInput()}

    </div>

    <FormFooter onClose={handleCancel} onSave={handleSave} showToggle={true} onToggleChange={handleAdvancedSettingsToggle} />
  </div>
);

};

export default ChainQueryForm;
