import React, { useState } from 'react';
import Modal from 'react-modal';
import { ApiPromise, WsProvider } from '@polkadot/api';

// Custom styles for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Component Props
interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any; // Type this according to what formData actually is in your application
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, formData }) => {
  const [encodedData, setEncodedData] = useState<string>('');
  const [hash, setHash] = useState<string>('');

  // Function to encode data and generate hash
  const encodeData = async () => {
    // Connect to a local node
    const provider = new WsProvider('ws://127.0.0.1:9944');
    const api = await ApiPromise.create({ provider });

    // Assume formData needs to be transformed or is ready to use
    const { data, section, method } = formData; // Mock example, adjust according to actual formData structure

    // Create a transaction
    const tx = api.tx[section][method](...data);

    // Encode the transaction
    const encoded = tx.toHex();
    setEncodedData(encoded);

    // Create the hash
    const txHash = tx.hash.toHex();
    setHash(txHash);
  };

  // Handle the modal opening, encode data
  React.useEffect(() => {
    if (isOpen) {
      encodeData();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Transaction Details"
    >
      <h2>Transaction Details</h2>
      <div>
        <strong>Metadata:</strong>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
      <div>
        <strong>Encoded Call Data:</strong>
        <p>{encodedData}</p>
      </div>
      <div>
        <strong>Transaction Hash:</strong>
        <p>{hash}</p>
      </div>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default TransactionModal;
