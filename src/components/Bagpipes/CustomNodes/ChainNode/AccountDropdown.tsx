import React, { useState, useContext } from 'react';
import { WalletContext } from '../../../Wallet/contexts';
import '../../../../index.css';
import '../../node.styles.scss';
import './AccountDropdown.scss';
import { WalletAccount } from '@subwallet/wallet-connect/types';

function AccountDropdown() {
  const walletContext = useContext(WalletContext);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null); 

  console.log("WalletContext:", walletContext);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAccAddress = event.target.value;
    const matchedAccount = walletContext.accounts.find(acc => acc.address === selectedAccAddress);
    setSelectedAccount(matchedAccount ? matchedAccount.address : null);
    console.log("Selected:", matchedAccount);
  };

  const displayAddress = (address: string) => {
    const start = address.slice(0, 6); // takes the first 6 characters
    const end = address.slice(-4); // takes the last 4 characters
    return `${start}...${end}`;
  };

  return (
    <div className="select-container unbounded-black">
      <select 
        value={selectedAccount || ""}
        onChange={handleChange}
        className='border border-gray-300 p-2 rounded-md w-full'
      >
        <option className="unbounded-black" value="" disabled>Select Address</option>
        {walletContext.accounts.map(acc => (
          <option className="unbounded-black" key={acc.address} value={acc.address}>
            {`${acc.name} (${displayAddress(acc.address)})`}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AccountDropdown;
