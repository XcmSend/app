// @ts-nocheck
import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { Select, Modal, Button } from 'antd';
import { useNodeId, } from 'reactflow';
import SocketContext from '../../../../contexts/SocketContext';
import CustomNode from '../CustomNode';
import { useAddressBook } from '../../../../contexts/AddressBookContext';
import useExecuteScenario from '../../hooks/useExecuteScenario';
import AccountDropdown from './AccountDropdown';
import '../../../../index.css';
import '../../node.styles.css';
import useAppStore from '../../../../store/useAppStore';
import AddContacts from './AddContacts'
import { chainOptions, assetOptions } from './options';

const ChainNode = ({ data, isConnectable }) => {
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


    // Mock function to fetch addresses from extension.
    const fetchAddressesFromExtension = () => {
      // Return a mock list of addresses for simplicity.
      return ["0xAddress1", "0xAddress2"];
    };
  
  // Assuming we have some function to fetch addresses from the extension
  const extensionAddresses = useMemo(() => fetchAddressesFromExtension(), []);



  // Filtered assets based on the selected chain
  const filteredAssets = selectedChain
  ? assetOptions.find(option => option.chain === selectedChain)?.assets
  : [];

  const addressesFromExtension = fetchAddressesFromExtension();



  const allOptions = [
    ...contacts.map(contact => ({ label: `${contact.name} (${contact.address})`, value: contact.address })),
    ...extensionAddresses.map(addr => ({ label: addr, value: addr }))
];



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

  const handleSaveAddress = async () => {
    const success = await addContact({ address: newAddress, name: newName });

    if (success) {
      setIsModalVisible(false);
      setSelectedContact(newAddress); // After successfully adding the contact, set it as the selected contact
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
      console.log(`Setting content for node ${nodeId}:`, nodeContentMap[nodeId]);  // Debugging info
      console.log(`Full node content map:`, nodeContentMap);  // Debugging info

    }
  }, [nodeContentMap, nodeId]);

return (
  <CustomNode nodeId={nodeId} isConnectable={isConnectable} data={data} isModalVisible={isModalVisible}>
    <div className="chain-selection">
      <select onChange={handleChainChange}>
          <option value="" disabled selected>
              Select a chain
          </option>
          {chainOptions.map(chain => (
              <option key={chain.value} value={chain.value}>
                  {chain.label}
              </option>
          ))}
      </select>
    </div>

    {selectedChain && (
      <div className="asset-selection">
          <select onChange={handleAssetChange} value={selectedAsset}>
              <option value="" disabled>Select an asset</option>
              {filteredAssets.map(asset => (
                  <option key={asset.value} value={asset.value}>
                     {asset.ticker} {asset.description}
                  </option>
              ))}
          </select>
      </div>
    )}


{selectedChain && (
    <div className="address-selection">
        <AccountDropdown onSelect={(address) => setSelectedAddress(address)} />
        <button onClick={() => setIsModalVisible(true)}>+ Address</button>
    </div>
)}

        {/* Assuming some condition here, we can display the contacts dropdown */}
      {selectedChain && contacts.length > 0 && (
        <div className="contact-selection">
          <Select 
              options={contacts.map(contact => ({ label: `${contact.name} (${contact.address})`, value: contact.address }))}
              value={selectedContact}
              onChange={(option) => setSelectedContact(option.value)}
          />
        </div>
      )}


<AddContacts />

      {selectedChain && (
          <div>
              <input 
                  type="number" 
                  placeholder="Enter asset amount" 
                  value={assetAmount}
                  onChange={(e) => setAssetAmount(e.target.value)}
              />
          </div>
      )}

    {loading ? (
      <div className="loading-indicator">Loading...</div>
    ) : null}

    <div className={nodeContent && 'typing-effect absolute px-1 pt-2 pb-2 rounded-b-lg bg-white -z-50 pt-3 px-2 pb-2 '}>
      {nodeContent}
    </div>
    </CustomNode>

);
};

export default ChainNode;
