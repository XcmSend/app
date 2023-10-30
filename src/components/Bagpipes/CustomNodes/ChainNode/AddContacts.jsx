import React, { useState } from 'react';
import { Modal } from 'antd';
import useAppStore from '../../../../store/useAppStore';
import { useAddressBook } from '../../../../contexts/AddressBookContext';
import '../../../../index.css';
import '../../node.styles.scss';

export default function AddContacts() {
    const [newAddress, setNewAddress] = useState(''); // To capture address in modal
    const [newName, setNewName] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const { addContact, contacts, error, setError } = useAddressBook();

    const { isModalVisible, setIsModalVisible } = useAppStore(state => ({ 
        isModalVisible: state.isModalVisible,
        setIsModalVisible: state.setIsModalVisible
      }));

    const handleSaveAddress = async () => {
        const success = await addContact({ address: newAddress, name: newName });
    
        if (success) {
          setIsModalVisible(false);
          setSelectedContact(newAddress); // After successfully adding the contact, set it as the selected contact
        }
      }

return (
    <Modal
        title="Add Address"
        open={isModalVisible}
        onOk={handleSaveAddress}
        onCancel={() => setIsModalVisible(false)}
    >
        <div className="p-4 bg-white rounded shadow-xl">
            <div className="mb-4">
                <label htmlFor="contact-name" className="block mb-2 text-sm font-bold text-gray-700">Contact Name:</label>
                <input type="text" id="contact-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Contact Name" className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4">
                <label htmlFor="address" className="block mb-2 text-sm font-bold text-gray-700">Address:</label>
                <input type="text" id="address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Substrate Address" className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" style={{ width: '400px' }} />
            </div>
                {error && (
            <div className="error-message">
                {error}
            </div>
        )}
        </div>  
    </Modal>
);
}