// @ts-nocheck
import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import {  Handle, Position, useNodeId } from 'reactflow';

import SocketContext from '../../../../contexts/SocketContext';
import CustomNode from '../CustomNode';
import { useAddressBook } from '../../../../contexts/AddressBookContext';
import useExecuteScenario from '../../hooks/useExecuteScenario';
import AccountDropdown from './AccountDropdown';
import '../../../../index.css';
import './ChainNode.scss';
import 'antd/dist/antd.css';
import '../../node.styles.scss';
import '../../../../main.scss';
import useAppStore from '../../../../store/useAppStore';
import AddContacts from './AddContacts'
import { chainOptions, assetOptions } from './options';
import '/plus.svg'

const ChainNode = ({ children, data, isConnectable }) => {
  const { nodeContent } = data;
  const socket = useContext(SocketContext);
  const { nodeContentMap, executeScenario } = useExecuteScenario();
  const nodeId = useNodeId();
  const [content, setContent] = useState("");
  const { loading, saveChainAddress, isModalVisible, setIsModalVisible } = useAppStore(state => ({ 
    loading: state.loading,
    isModalVisible: state.isModalVisible,
    setIsModalVisible: state.setIsModalVisible
  }));
  const { addContact, contacts, error, setError } = useAddressBook();
  const [selectedChain, setSelectedChain] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newAddress, setNewAddress] = useState(''); // To capture address in modal
  const [newName, setNewName] = useState('');
  const [allAddresses, setAllAddresses] = useState([]);
  const [assetAmount, setAssetAmount] = useState("");
  const inputRef = useRef(null);


  const fetchAddressesFromExtension = () => {
    // Return a mock list of addresses for simplicity.
    return [];
  };
  
  // Assuming we have some function to fetch addresses from the extension
  const extensionAddresses = useMemo(() => fetchAddressesFromExtension(), []);

  // Filtered assets based on the selected chain
  const filteredAssets = selectedChain
  ? assetOptions.find(option => option.chain === selectedChain)?.assets
  : [];

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


  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
    const assetsForSelectedChain = assetOptions.find(option => option.chain === e.target.value)?.assets;
    if (assetsForSelectedChain?.length) {
      setSelectedAsset(assetsForSelectedChain[0].value);
    } else {
      setSelectedAsset(null);
    }
  }

  const handleAssetChange = (e) => {
    setSelectedAsset(e.target.value);
  };

    useEffect(() => {
      if (loading) { // If a new execution is starting...
        setContent(""); // Clear the content
    } else {
      setContent(nodeContentMap[nodeId] || '');
      console.log(`Setting content for node ${nodeId}:`, nodeContentMap[nodeId]); 
      console.log(`Full node content map:`, nodeContentMap); 

    }
  }, [nodeContentMap, nodeId]);

  return (
    <div className="custom-node rounded-lg shadow-lg text-xs p-4 bg-gray-100"> {/* Added background for light grey */}
      <Handle id="a" type="target" position={Position.Left} isConnectable={isConnectable} />
      <Handle id="b" type="source" position={Position.Right} isConnectable={isConnectable} />
    <div className="m-2">
      <div className="border p-2 rounded mb-2 ">
        <div className="chain-selection mb-2">
          <h3 className="text-xxs text-gray-400 primary-font mb-1">Chain</h3> {/* Title */}
          <select className="chain-selector unbounded-bold text-black border border-gray-300 p-2 rounded" onChange={handleChainChange}>
            <option value="" disabled selected>
              Select chain
            </option>
            {chainOptions.map(chain => (
              <option key={chain.value} value={chain.value}>
                {chain.label}
              </option>
            ))}
          </select>
        </div>
  
        {selectedChain && (
          <div className="asset-selection mb-2">
            <h3 className="text-xxs text-gray-400 primary-font mb-1">Asset</h3>
            <select className="asset-selector unbounded-bold text-black border border-gray-300 p-2 rounded" onChange={handleAssetChange} value={selectedAsset}>
              <option value="" disabled>Select an asset</option>
              {filteredAssets.map(asset => (
                <option key={asset.value} value={asset.value}>
                 <div className='unbounded-black'>{asset.ticker}</div> <div className='unbounded'>{asset.description}</div>
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
  
      {selectedChain && (
        <div className="flex flex-col items-start mb-2 border p-2 rounded">
          <h3 className="text-xxs text-gray-400 primary-font mb-2 self-start ">Addresses</h3>
          <div className="flex items-center text-black justify-start  w-full">
            <AccountDropdown onSelect={(address) => setSelectedAddress(address)} />
          
          </div>
          <AddContacts />
        </div>
      )}
  
  {selectedChain && contacts.length > 0 && (
    <div className="mb-2 border p-2 rounded flex flex-col items-start justify-start">
        <h3 className="text-xxs text-gray-400 primary-font mb-2 self-start">Contacts</h3>
        <select 
            className="contact-selector unbounded-bold font-semibold text-black border border-gray-300 p-2 rounded"
            value={selectedContact || ""}
            onChange={(e) => {
                if(e.target.value === 'create_new_contact') {
                   <AddContacts />
                   setIsModalVisible(true)
                  } else {
                    setSelectedContact(e.target.value);
                }
            }}
        >
            <option value="create_new_contact" style={{ borderBottom: '1px solid #ccc', fontWeight: 500 }}>Create New Contact</option> {/* Added style for borderBottom */}
            <option value="" disabled>Select Contact</option>
            {contacts.map(contact => (
                <option key={contact.address} value={contact.address}>
                    {`${contact.name} (${contact.address})`}
                </option>
            ))}
        </select>
    </div>
)}


      {selectedChain && (
        <div className="mb-2 border p-2 rounded">
          <h3 className="text-xxs text-gray-400 primary-font mb-1">Amount</h3>
          <div className="unbounded-black">
          <input 
            className='unbounded-black text-xl text-black pl-1 border border-gray-300 rounded amount-selector'
            type="number" 
            placeholder="0.0000" 
            value={assetAmount}
            onChange={(e) => setAssetAmount(e.target.value)}
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
