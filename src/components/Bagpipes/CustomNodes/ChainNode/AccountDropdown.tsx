import React, { useState, useContext } from 'react';
import { WalletContext } from '../../../Wallet/contexts';
import '../../../../index.css';
import '../../node.styles.scss';
import './AccountDropdown.scss';
import { WalletAccount } from '@subwallet/wallet-connect/types';
import { listChains } from '../../../../components/Chains/ChainsInfo';
import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';

function AccountDropdown({ selectedChainName, onSelect }: { selectedChainName: string, onSelect: (address: string) => void }) {
  const walletContext = useContext(WalletContext);
  const chains = listChains(); 
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null); 

  console.log("WalletContext:", walletContext);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAccAddress = event.target.value;
    const matchedAccount = walletContext.accounts.find(acc => acc.address === selectedAccAddress);
    setSelectedAccount(matchedAccount ? matchedAccount.address : null);
    console.log("Selected:", matchedAccount);
  };

  const displayAddress = (address: string, prefix: number) => {
    const encodedAddress = encodeAddress(decodeAddress(address), prefix);
    const start = encodedAddress.slice(0, 6); 
    const end = encodedAddress.slice(-4); 
    return `${start}...${end}`;
  };

  const getPrefixForAddress = (address: string) => {
    // Using the passed chain name to fetch the correct prefix
    const chainInfo = Object.values(chains).find(chain => chain.name === selectedChainName);
    console.log("ChainInfo:", chainInfo);
    return chainInfo ? chainInfo.prefix : 42; // Default to 42 if not found
  };

  return (
    <div className="select-container font-semibold">
      <select 
        value={selectedAccount || ""}
        onChange={handleChange}
        className='border border-gray-300 p-2 rounded-md w-full'
      >
        <option className="" value="" disabled>Select Address</option>
        {walletContext.accounts.map(acc => (
          <option className="" key={acc.address} value={acc.address}>
            {`${acc.name} (${displayAddress(acc.address, getPrefixForAddress(acc.address))})`}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AccountDropdown;



