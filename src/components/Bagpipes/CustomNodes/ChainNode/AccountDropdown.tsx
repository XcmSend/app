
import React, { useState, useContext, useRef, useEffect } from 'react';
import Dropdown from './Dropdown';
import { WalletContext } from '../../../Wallet/contexts';

import './AccountDropdown.scss' ;
import { WalletAccount } from '@subwallet/wallet-connect/types';

function AccountDropdown() {
  const walletContext = useContext(WalletContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null); // New state for selected account

 
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (account: WalletAccount) => {
    setSelectedAccount(account);  // Store the entire account object in the state
    setDropdownOpen(false);  // Close dropdown after selecting
  };

  return (
    <Dropdown 
    options={walletContext.accounts}
    renderOption={(acc: { name: any; address: any; }) => `${acc.name} (${acc.address})`}
    onOptionSelected={(selectedAcc: any) => console.log("Selected:", selectedAcc)}
    placeholder="Select Address"
  />
  );
}

export default AccountDropdown;