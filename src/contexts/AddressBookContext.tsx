// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { keyring } from '@polkadot/ui-keyring';
import { decodeAddress } from '@polkadot/util-crypto';

export interface Contact {
  name: string;
  address: string;
}

interface AddressBookContextProps {
  contacts: Contact[];
  addContact: (contact: Contact) => Promise<boolean>;
  removeContact: (address: string) => void; 
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  error: string | null;

}

const AddressBookContext = createContext<AddressBookContextProps>({
  addContact: async (_contact: Contact): Promise<boolean> => {
    await Promise.resolve();

    return true;
  },
  removeContact: (_address: string) => { /* noop function */ },  // This is the default function

  contacts: [],
  error: null,
  setError: () => {
    /** */
  }
});

interface AddressBookProviderProps {
  children: ReactNode;
}

export const AddressBookProvider = ({ children }: AddressBookProviderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(() => {
    // Try to read the contacts from localStorage when the component loads
    const savedContacts = window.localStorage.getItem('contacts');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return savedContacts ? JSON.parse(savedContacts) : [];
  });

  const addContact = async (contact: Contact): Promise<boolean> => {
    return new Promise((resolve, _reject) => {
      setContacts((prevContacts) => {
        // Check for valid address
        try {
          decodeAddress(contact.address);
        } catch {
          console.error('The provided address is invalid.');
          setError('The provided address is invalid.');
          resolve(false);

          return prevContacts;
        }

        // Check for duplicates
        const duplicateContact = prevContacts.find((c) => c.address === contact.address);

        if (duplicateContact) {
          console.error(`You have already saved this address as ${duplicateContact.name}`);
          setError(`You have already saved this address as ${duplicateContact.name}`);
          resolve(false);

          return prevContacts;
        }

        const duplicateName = prevContacts.find((c) => c.name === contact.name);

        if (duplicateName) {
            console.log('Current contacts:', prevContacts);
          console.error(`You have already saved a contact with the name ${duplicateName.name}`);
          setError(`You have already saved a contact with the name ${duplicateName.name}`);
          resolve(false);

          return prevContacts;
        }

        const updatedContacts = [...prevContacts, contact];

        window.localStorage.setItem('contacts', JSON.stringify(updatedContacts));

        // Save the contact to the keyring
        keyring.saveAddress(contact.address, {
          isTesting: true, // adjust as needed
          meta: {
            isTesting: true,
            name: contact.name
          },
          name: contact.name
        });

        console.log('Contact saved to keyring: ', keyring.getAddress(contact.address));
        setError(null);
        resolve(true);

        return updatedContacts;
      });
    });
  };

  const removeContact = (addressToRemove: string) => {
    setContacts(prevContacts => prevContacts.filter(contact => contact.address !== addressToRemove));
    // Remove from localStorage as well
    window.localStorage.setItem('contacts', JSON.stringify(contacts.filter(contact => contact.address !== addressToRemove)));
    // Also remove from the keyring
    keyring.forgetAddress(addressToRemove);
};


  useEffect(() => {
    console.log('Contacts before saving to local storage: ', contacts);
    window.localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  return (
    <AddressBookContext.Provider value={{ addContact, removeContact, contacts, error, setError }}>
      {children}
    </AddressBookContext.Provider>
  );
};

export const useAddressBook = () => useContext(AddressBookContext);