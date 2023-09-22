// @ts-nocheck
import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import {  Handle, Position, useNodeId } from 'reactflow';
import SocketContext from '../../../../contexts/SocketContext';
import CustomNode from '../CustomNode';
import { useAddressBook } from '../../../../contexts/AddressBookContext';
import useExecuteScenario from '../../hooks/useExecuteScenario';
import AccountDropdown from './AccountDropdown';
import useAppStore from '../../../../store/useAppStore';
import AddContacts from './AddContacts'
import {  getAssetOptions } from './options';
import { listChains } from '../../../Chains/ChainsInfo';
import { getSavedFormState, setSavedFormState } from '../../utils/storageUtils';
import { getAssetBalanceForChain } from '../../../Chains/AssetHelper';
import BalanceTippy from './BalanceTippy';
import 'antd/dist/antd.css';
import '../../../../index.css';
import './ChainNode.scss';
import '../../node.styles.scss';
import '../../../../main.scss';

import '/plus.svg'

const ChainNode = ({ children, data, isConnectable }) => {
  const { nodeContent } = data;
  const socket = useContext(SocketContext);
  const { nodeContentMap, executeScenario } = useExecuteScenario();
  const nodeId = useNodeId();
  const [content, setContent] = useState("");
  const savedState = getSavedFormState(nodeId); 
  const { scenarios, activeScenarioId, loading, saveChainAddress, isModalVisible, setIsModalVisible, saveNodeFormData  } = useAppStore(state => ({ 
    scenarios: state.scenarios,
    activeScenarioId: state.activeScenarioId,
    loading: state.loading,
    isModalVisible: state.isModalVisible,
    setIsModalVisible: state.setIsModalVisible,
    saveNodeFormData: state.saveNodeFormData,

  }));
  // const [formState, setFormState] = useState(savedState || initialState);
  const { addContact, contacts, error, setError } = useAddressBook();
  const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
  const [newAddress, setNewAddress] = useState(''); // To capture address in modal
  const [newName, setNewName] = useState('');
  const [allAddresses, setAllAddresses] = useState([]);

  const [chainList, setChainList] = useState({});
  const [assetOptions, setAssetOptions] = useState([]);
  const [assetsForChain, setAssetsForChain] = useState([]);
  const initialState = savedState || {
    chain: "",
      asset: {
          name: "",
          assetId: null
      },
      address: "",
      amount: null,
      contact: null
  };
  const [formState, setFormState] = useState(savedState || initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);

  const inputRef = useRef(null);
  const ChainInfoList = Object.values(chainList);

  const fetchAddressesFromExtension = () => {
    // Return a mock list of addresses for simplicity.
    return [];
  };
  
  // Assuming we have some function to fetch addresses from the extension
  const extensionAddresses = useMemo(() => fetchAddressesFromExtension(), []);

  // Filtered assets based on the selected chain
  const assetsForSelectedChain = assetOptions.find(option => option.chain === formState.chain)?.assets || [];
  const filteredAssets = Array.isArray(assetsForSelectedChain) ? assetsForSelectedChain : [assetsForSelectedChain];
    // console.log('ChainInfoList', ChainInfoList)
    const selectedChainLogo = ChainInfoList.find(chain => chain.name === formState.chain)?.logo;

    const handleFormChange = (field, value) => {
      setFormState(prev => ({
          ...prev,
          [field]: value
      }));
  };

  const handleChainChange = async (e) => {
    const selectedChainName = e.target.value;
    
    // Update the chain in the form state
    handleFormChange("chain", selectedChainName);
    setIsLoading(true);
  };

  const handleAssetChange = (e) => {
    const selectedAssetName = e.target.value;
    let selectedAssetInfo;

    if (selectedAssetName !== 'Select an asset') {
      selectedAssetInfo = assetsForChain.find(asset => asset.asset.name === selectedAssetName);
      // console.log('selectedAssetInfo', selectedAssetInfo);
    }
    if (selectedAssetInfo) {
      setFormState(prevState => ({
        ...prevState,
        asset: {
          name: selectedAssetInfo.asset.name,
          assetId: selectedAssetInfo.assetId
        }
      }));
    } else {
      setFormState(prevState => ({
        ...prevState,
        asset: null
      }));
    }
};

  

  useEffect(() => {
    if (formState.chain) {
      const controller = new AbortController();
      const signal = controller.signal;
  
      const fetchAssets = async () => {
        try {
          const assetsData = await getAssetOptions(formState.chain, signal); 
          if (!signal.aborted) {
            setAssetsForChain(assetsData.assets);
            console.log('Fetched assets:', assetsData);
  
            if (!formState.asset && assetsData.assets?.length) {
              handleFormChange("asset", assetsData.assets[0]);
            }
          }
        } catch (error) {
          if (!signal.aborted) {
            console.error("Failed to fetch assets for chain", formState.chain, error);
            // Handle this error as needed, maybe show a user-friendly message
          }
        } finally {
          if (!signal.aborted) {
            setIsLoading(false);
          }
        }
      };
  
      fetchAssets();
  
      return () => controller.abort();  // Cleanup function
    }
  }, [formState.chain]);
  


  useEffect(() => {
    console.log('Updated formState:', formState);
  }, [formState]);


  useEffect(() => {
    setFormState(initialState);
  }, [nodeId]);

  useEffect(() => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    if (currentNodeFormData) {
        setFormState({
            chain: currentNodeFormData?.chain?.name || "",
            asset: {
                name: currentNodeFormData?.asset?.name || "",
                assetId: currentNodeFormData?.asset?.assetId || null
            },
            // ... Add other fields
        });
    }
  }, [ nodeId, activeScenarioId]);

  useEffect(() => {
    // The formData structure remains the same.
    const formData = { ...formState };
    
    console.log('saving nodeFormData', formData, nodeId);

    saveNodeFormData(activeScenarioId, nodeId, formData);
    setSavedFormState(nodeId, formData); // save to local storage
  }, [formState]);

  useEffect(() => {
    const currentNodeFormData = scenarios[activeScenarioId]?.diagramData?.nodes?.find(node => node.id === nodeId)?.formData;
    
    if (currentNodeFormData) {
        setFormState(currentNodeFormData);
    }
  }, [ nodeId, activeScenarioId]);

  useEffect(() => {
    console.log('contacts', contacts)

    setAllAddresses([...extensionAddresses, ...contacts.map(contact => contact.address)]);
  }, [extensionAddresses, contacts]);


  useEffect(() => {
    console.log("isModalVisible", isModalVisible);

    if (isModalVisible && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isModalVisible]);


  useEffect(() => {
    if (loading) { // If a new execution is starting...
      setContent(""); // Clear the content
    } else {
      setContent(nodeContentMap[nodeId] || '');
      console.log(`Setting content for node ${nodeId}:`, nodeContentMap[nodeId]); 
      console.log(`Full node content map:`, nodeContentMap); 

    }
  }, [nodeContentMap, nodeId]);

  useEffect(() => {
    const fetchChains = async () => {
        const chains = listChains();
        setChainList(chains);
    };

    fetchChains();
  }, []);

  const fetchBalance = async (signal) => {
    try {
      console.log('[fetchBalance] [raw] Fetching balance for', formState.chain, formState.asset.assetId, formState.address);
      setIsFetchingBalance(true);
      const fetchedBalance = await getAssetBalanceForChain(formState.chain, formState.asset.assetId, formState.address, signal); 
      if (!signal.aborted) {
        console.log('[fetchBalance] Fetched balance:', fetchedBalance);
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

    fetchBalance(signal);

    return () => controller.abort();
}, [formState.chain, formState.asset, formState.address]);

console.log('Component re-rendered', formState.address);



  return (
    <div className="custom-node  shadow-lg text-xs p-4 bg-gray-100"> {/* Added background for light grey */}
    <h1 className="text-xxs text-gray-400 primary-font mb-1">{nodeId}</h1>

        {selectedChainLogo && (
            <div className="chain-logo-container mb-2 mt-2 flex justify-center">
              <img src={selectedChainLogo} alt={`${formState.chain} Logo`} className="chain-logo w-12 h-12" /> {/* Adjust w-16 and h-16 as necessary */}
            </div>
          )}
      <Handle id="a" type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle id="b" type="source" position={Position.Right} isConnectable={isConnectable} />
    <div className="m-2">
      <div className="border p-2 rounded mb-2 ">
        <div className="chain-selection mb-2">
          <h3 className="text-xxs text-gray-400 primary-font mb-1">Chain</h3> {/* Title */}
          <select 
              className="chain-selector font-semibold text-black border border-gray-300 p-2 rounded"
              onChange={handleChainChange}
              value={formState.chain}  // This sets the value for the dropdown from the state
          >
              <option value="" selected>Select chain</option>
              {ChainInfoList.map((ChainInfo, index) => (
                  <option key={ChainInfo.name} value={ChainInfo.name}>
                      {ChainInfo.display}
                  </option>
              ))}
          </select>

        </div>
        </div>
        <div className="border p-2 rounded mb-2 ">



        {formState.chain && (
          <div className="asset-selection mb-2">
            <h3 className="text-xxs text-gray-400 primary-font mb-1">Asset</h3>
            {isLoading ? (
               <div className="select-container">
               <div className="border border-gray-300 p-2 rounded-md w-full">
                 <div className="spinner"></div>  
               </div>
             </div>
          ) : (
            <select className="asset-selector text-black border border-gray-300 p-2 rounded font-semibold" onChange={handleAssetChange} value={formState.asset ? formState.asset.name : ""}>
              <option value="">Select an asset</option>
               {assetsForChain.map(asset => (
                   <option key={asset.assetId} value={asset.asset.name}>
                     {asset.asset.name} | AssetId: {asset.assetId}
                   </option>
               ))}
            </select>
          )}
          </div>
        )}
      </div>
  
  {formState.chain && (
    <div className="flex flex-col items-start mb-2 border p-2 rounded">
      <h3 className="text-xxs text-gray-400 primary-font mb-2 self-start ">Addresses</h3>
      <div className="flex items-center text-black justify-start  w-full">
                <AccountDropdown 
                    selectedChainName={formState.chain}
                    selectedAddress={formState.address}  // Pass address value from state
                    onSelect={(address) => handleFormChange("address", address)} 
                />
      
      </div>
      <AddContacts />
    </div>
  )}
  
  {formState.chain && contacts.length > 0 && (
    <div className="mb-2 border p-2 rounded flex flex-col items-start justify-start">
        <h3 className="text-xxs text-gray-400 primary-font mb-2 self-start">Contacts</h3>
        <select 
            className="contact-selector font-semibold text-black border border-gray-300 p-2 rounded"
            value={formState.contact || ""}
            onChange={(e) => {
                if(e.target.value === 'create_new_contact') {
                   <AddContacts />
                   setIsModalVisible(true)
                  } else {
                    handleFormChange("contact", e.target.value);
                  }
            }}
        >
            <option value="create_new_contact" style={{ borderBottom: '1px solid #ccc', fontWeight: 500 }}>Create New Contact</option> {/* Added style for borderBottom */}
            <option value="">Select Contact</option>
            {contacts.map(contact => (
                <option key={contact.address} value={contact.address}>
                    {`${contact.name} (${contact.address})`}
                </option>
            ))}
        </select>
    </div>
  )}

{formState.chain && (
   <div className="mb-2 border p-2 rounded">
     <h3 className="text-xxs text-gray-400 primary-font mb-1 flex items-center justify-between">
       Amount 
       <div className="flex items-center primary-font">

        {isFetchingBalance ? (
          <div className="small-spinner"></div>
        ) : (
          balance !== null && (
            <BalanceTippy balance={balance} />
          )
        )}
        <button onClick={fetchBalance} className="text-xs m-1 p-0 rounded refresh-button">
          <img className="h-3 w-3" src="/refresh.svg" />
        </button>
        
      </div>
     </h3>
     <div className="unbounded-black">
       <input 
         className='unbounded-black text-xl text-black pl-1 border border-gray-300 rounded amount-selector'
         type="number" 
         placeholder="0.0000" 
         value={formState.amount}
         onChange={(e) => handleFormChange('amount', e.target.value)}
       />
     </div>
   </div>
)}


      {loading ? (
        <div className="loading-indicator mb-2">Loading...</div>
      ) : null}
      
      <div className={nodeContent && 'typing-effect absolute px-1 pt-2 pb-2 rounded-b-lg bg-white -z-50 pt-3 px-2 pb-2 '}>
        {nodeContent}
      </div>
    </div>
    </div>
  );
  
};

export default ChainNode;
