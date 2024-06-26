import React, { useState, useEffect, useMemo, useContext } from 'react';
import useAppStore from '../../../../../../store/useAppStore';
import { WalletContext } from '../../../../../Wallet/contexts';
import { getAssetBalanceForChain } from '../../../../../../Chains/Helpers/AssetHelper';
import BalanceTippy from './BalanceTippy';

import { broadcastToChain } from '../../../../../../Chains/api/broadcastToChain';

import toast  from 'react-hot-toast';
import { ChainToastContent, ActionToastContent, CustomToastContext } from '../../../../../toasts/CustomToastContext'

import { processScenarioData, validateDiagramData, processAndSanitizeFormData, getUpstreamNodeIds } from '../../../../utils/scenarioUtils';
import { getOrderedList } from '../../../../hooks/utils/scenarioExecutionUtils';

import { CollapsibleField }  from '../../../fields';
import { ChainQueryIcon } from '../../../../../Icons/icons';
import { useTippy } from '../../../../../../contexts/tooltips/TippyContext';
import { listChains} from '../../../../../../Chains/ChainsInfo';
import { queryMetadata } from './QueryMetadata';
import { parseMetadataPallets, resolveTypeName, resolveFieldType } from '../parseMetadata'
import { parseLookupTypes } from '../ParseMetadataTypes';
import { resolveKeyType } from '../resolveKeyType';
import ChainRpcService from '../../../../../../services/ChainRpcService';
import FormHeader from '../../../FormHeader';
import FormFooter from '../../../FormFooter';

import '../types';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';

import '../ChainForm.scss';
import '../../Popup.scss';
import '../../../../../../index.css';


const ChainTxForm = ({ onSubmit, onSave, onClose, onEdit, nodeId }) => {
  const { scenarios, activeScenarioId, saveNodeFormData, clearSignedExtrinsic, markExtrinsicAsUsed, updateNodeResponseData } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    saveNodeFormData: state.saveNodeFormData,
    clearSignedExtrinsic: state.clearSignedExtrinsic,
    markExtrinsicAsUsed: state.markExtrinsicAsUsed,
    updateNodeResponseData: state.updateNodeResponseData,
   }));
   const walletContext = useContext(WalletContext);
   const [balance, setBalance] = useState(null);
   const [isFetchingBalance, setIsFetchingBalance] = useState(false);
   const [chainSymbol, setChainSymbol] = useState('');

  const formData = scenarios[activeScenarioId]?.diagramData?.nodes.find(node => node.id === nodeId)?.formData || {};
  console.log('ChainTxForm formData:', formData);

  const [metadata, setMetadata] = useState(null); 
  console.log('ChainTxForm metadata:', metadata);

  const [pallets, setPallets] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedChain, setSelectedChain] = useState(formData.selectedChain || '');
  const [selectedPallet, setSelectedPallet] = useState(formData.selectedPallet || null);
  const [selectedMethod, setSelectedMethod] = useState(formData.selectedMethod || null);
  const [selectedParams, setSelectedParams] = useState(formData.selectedParams || null);

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
       

        try {
            const metadata = await queryMetadata(chainName);
            setMetadata(metadata);
            const parsedPallets = parseMetadataPallets(metadata);
            setPallets(parsedPallets);
        } catch (error) {
            console.error('Error fetching metadata:', error);
        }
    }
    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedChain: chainName, selectedMethod: null, selectedPallet: null, params: null});
  };

    
  const handlePalletChange = (palletName) => {
    const newPallet = pallets.find(p => p.name === palletName);
    if (newPallet && newPallet !== selectedPallet) {
        setSelectedPallet(newPallet);
        setSelectedMethod(null); 
        setSelectedParams({});
        console.log('handlePalletChange New Pallet  selectedMethod changing to null:', selectedMethod, newPallet);

    }
    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedPalletData: newPallet, selectedPallet: palletName, selectedMethod: null, params: null});
  };

  const handleMethodChange = (methodName) => {
    const newMethod = formData.selectedPalletData?.calls.find(calls => calls.name === methodName);
    console.log('handleMethodChange New Method:', newMethod);
    if (newMethod && newMethod !== selectedMethod) {
        setSelectedMethod(newMethod);
        setSelectedParams({});
    }
    // setSelectedMethod(newMethod);

    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedMethod: newMethod, params: null});
  };


  const handleMethodFieldChange = (fieldName, newFieldValue) => {
    // Update the specific field inside formData.params
    const updatedParams = {
        ...formData.params, 
        [fieldName]: newFieldValue
    };
    const updatedValues = {
        ...formData,
        params: updatedParams
    };
    saveNodeFormData(activeScenarioId, nodeId, updatedValues);
};

  // handlers for the form fields

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
        nodeId="address-dropdown"
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
    if (!formData.selectedPalletData) return null;



    // Check if `calls` array exists and has elements
    if (!formData.selectedPalletData.calls || formData.selectedPalletData.calls.length === 0) {
      return <div>No transaction methods available for this pallet.</div>;
    }

    const generateCustomContent = () => {
  

    };
    

    // Directly use the calls array since each entry represents a method
    const methods = formData.selectedPalletData.calls;
  
    return (
      <CollapsibleField
        key="methodDropdown"
        title="Select Method"
        hasToggle={true}
        customContent={generateCustomContent()}
        fieldTypes="select"
        nodeId={nodeId}
        info="Select a transaction method to execute"
        selectOptions={methods.map(method => ({ label: method.name, value: method.name }))}
        value={formData?.selectedMethod?.name || ''}
        onChange={(value) => handleMethodChange(value)}
      />
    );
  };
  

  const renderMethodFields = () => {
    if (!formData.selectedMethod) {
        return null;  
    }

    const customContent = Object.keys(lookupTypes).length === 0 
                          ? <div>Loading data or incomplete metadata...</div>
                          : null;

    return formData.selectedMethod.fields.map((field, index) => {
        const fieldTypeObject = resolveFieldType(field.type, lookupTypes);
        console.log('Field Type ID:', fieldTypeObject);
        return (
            <CollapsibleField
                key={index}
                title={`${field.name} <${field.typeName || resolveTypeName(field.type, lookupTypes)}> `}
                info={field.docs || 'No documentation available.'}
                fieldTypes={fieldTypeObject.type}  
                customContent={customContent}
                hasToggle={true}
                nodeId={formData.nodeId}
                value={formData.params?.[field.name] || ''}
                onChange={(newFieldValue) => handleMethodFieldChange(field.name, newFieldValue)} // Pass the onChange handler
                placeholder={`Enter ${field.name}`}
                // Pass typesLookup if needed for dynamic rendering within the field
                typesLookup={lookupTypes}
                elementType={fieldTypeObject.elementType}
            />
        );
    });
};


const renderSignAndSendTx = () => {
  if (!formData.selectedMethod) {
      return null;
  }
    return (
      <CollapsibleField
      title={`Sign and Send Tx`}
      info={'Sign and send a transaction just within this node. If you use pills then it will use the data from the previous scenario workflow execution that was made.'}
      fieldTypes="buttonTextArea"
      buttonName="Submit Tx"
      nodeId={nodeId}
      value={result}
      isTextAreaValue={isTextAreaValue}
      onClick={handleSignMethodClick}
      // onPillsChange={(updatedPills) => handlePillsChange(updatedPills, field.name)}
      placeholder={`Enter`}
      disabled={!formData.selectedMethod}
  />
    );
};
  
  


  const handleSignMethodClick = async () => {
    setIsTextAreaValue(true);
    clearSignedExtrinsic(activeScenarioId, nodeId);


    if (!selectedMethod) {
        alert("No method selected. Please select a method before attempting to sign.");
        return;
    }

    if (!formData.selectedChain || !formData.selectedPallet || !formData.selectedAddress) {
        alert("Missing required information: Please ensure a chain, pallet, and signer address are selected.");
        return;
    }
    
    const lastExecutionId = useAppStore.getState().executionId;
    const recentExecutions = useAppStore.getState().scenarios[activeScenarioId]?.executions
    const lastExecution = recentExecutions[lastExecutionId];
    console.log('Active Execution Data:', lastExecution);

    const diagramData = scenarios[activeScenarioId]?.diagramData;
    const orderedList = getOrderedList(diagramData.edges);


    try {

      const upstreamNodeIds = getUpstreamNodeIds(orderedList, nodeId);
      const parsedFormData = processAndSanitizeFormData(formData, lastExecution, upstreamNodeIds);

      const presignPack = `Draft Tx ready to sign: \naddress: ${parsedFormData.selectedAddress}, \nchain: ${parsedFormData.selectedChain}, \npallet: ${parsedFormData.selectedPallet}, \nmethod: ${parsedFormData.selectedMethod.name}, \nparams: ${Object.values(parsedFormData.params)}\n`;
      setResult(presignPack);

      console.log('Parsed Form Data:', parsedFormData);
      saveNodeFormData(activeScenarioId, nodeId, {
        ...formData,
        isSigned: false
    });
        const signedExtrinsic = await ChainRpcService.executeChainTxMethod({
            chainKey: parsedFormData.selectedChain,
            palletName: parsedFormData.selectedPallet,
            methodName: parsedFormData.selectedMethod.name,
            params: Object.values(parsedFormData.params || {}),
            signer: walletContext?.wallet?.signer,
            signerAddress: parsedFormData.selectedAddress
        });
        // Update the store with signed transaction and signed status
        saveNodeFormData(activeScenarioId, nodeId, {
          ...formData,
            signedExtrinsic: signedExtrinsic,
            isSigned: true
        });
        const resultPack = `Chain Tx signed for: \naddress: ${parsedFormData.selectedAddress}, \nchain: ${parsedFormData.selectedChain}, \npallet: ${parsedFormData.selectedPallet}, \nmethod: ${parsedFormData.selectedMethod.name}, \nparams: ${Object.values(parsedFormData.params)}\n`;
        const nextSteps = `Transaction signed successfully and is now being submitted to the chain...\n`;
        const submittingTransaction = `Submitting transaction...\n`;
        setResult(resultPack);
        setResult(resultPack + nextSteps);

        
    // } catch (error) {
    //     const failedTransaction = `Failed to sign transaction. Error: ${error.message} \n`;

    //     console.error('Execution failed:', error);
    //     setResult(result + failedTransaction);
    //     // alert(`Failed to sign transaction: ${error.message}`);
    // }

    // try {

      await broadcastToChain(formData.selectedChain, signedExtrinsic, {
          onInBlock: (blockHash) => {
              setResult(resultPack + nextSteps + "Tx in block...\n");

              console.log(`Transaction included at blockHash: ${blockHash}`);
              toast.success(`Transaction included at blockHash: ${blockHash}`);
              // updateNodeResponseData(activeScenarioId, lastExecutionId, nodeId, { inBlock: blockHash });
              console.log('[markExtrinsicAsUsed] first attempt to clear signed extrinsic...');
              markExtrinsicAsUsed(activeScenarioId, nodeId);
          },
          onFinalized: (blockHash) => {
              setResult(resultPack + nextSteps + "Tx in block..." + "Tx finalized...");
              toast.success(`Transaction finalized at blockHash: ${blockHash}`);
              // updateNodeResponseData(activeScenarioId, lastExecutionId, nodeId, { finalized: blockHash });
              saveNodeFormData(activeScenarioId, nodeId, { ...formData, signedExtrinsic: '' });
              console.log('clearing signed extrinsic...', formData);
          },
          onError: (error) => {
              setResult(result + "Tx error ...");
              toast.error(`Action execution failed: ${error.message}`);
              // updateNodeResponseData(activeScenarioId, lastExecutionId, nodeId, { error: error.message });
              console.log('second attempt to clear signed extrinsic...');
          },
      });


    } catch (error) {
      const failedTransaction = `Failed to sign transaction. Error: ${error.message} \n`;

      // This catch block is for handling errors not caught by the onError callback, e.g., network issues
      toast.error(`Error broadcasting transaction for ChainTx: ${error.message}`);
      setResult(result + failedTransaction);
    }
    
    // toast(<ActionToastContent type={formData?.actionData?.actionType} message={`Broadcasted to Chain: ${sourceChain}`} signedExtrinsic={signedExtrinsic} />);
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

  const fetchBalance = async (signal) => {
    // console.log('getAssetBalanceForChain fetchBalance address:', address, 'chain:', chain);
    // if (!address || !chain) return;
    const chainKey = formData.selectedChain;
    setIsFetchingBalance(true);
    const chainsArray = Object.values(listChains()); // Convert to array if originally an object
    const chain = chainsArray.find(c => c.name.toLowerCase() === chainKey.toLowerCase());
    setChainSymbol(chain.symbol || '');
    console.log('fetchBalance chain symbol:', chain.symbol);
      if (!chain) {
      console.error("No chain information available for:", chainKey);
      return;
    }
    try {
      const fetchedBalance = await getAssetBalanceForChain(formData.selectedChain, 0, formData.selectedAddress);
      setBalance(fetchedBalance);
      if (!signal.aborted) {
        setBalance(fetchedBalance);
      }
    } catch (error) {
      if (!signal.aborted) {
        console.error("Failed to fetch balance", error);
      }
    } finally {
      if (!signal.aborted) {
        setIsFetchingBalance(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (formData.selectedAddress && formData.selectedChain) {

    fetchBalance(signal);
    }
    return () => controller.abort();
  }, [formData.selectedAddress, formData.selectedChain]);

  const handleAddressChange = (newAddress) => {
    // Update formData with the new address
    saveNodeFormData(activeScenarioId, nodeId, {...formData, selectedAddress: newAddress});
  };


return (
  <div onScroll={handleScroll} className=''>
      <FormHeader onClose={handleCancel} title='Chain Tx Form' logo={<ChainQueryIcon className='h-4 w-4' fillColor='black' />} />  

      <div className='http-form'>
          
          {renderAddressSelection()} 
          {renderChainSelection()}
          {renderPalletSelection()}
          {renderMethodSelection()}
          {renderMethodFields()}
          {renderSignAndSendTx()}


    </div>


      <FormFooter onClose={handleCancel} onSave={handleSave} showToggle={true} onToggleChange={handleAdvancedSettingsToggle} />
  </div>
);

};

export default ChainTxForm;
