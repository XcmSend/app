import { web3Accounts, web3Enable, web3AccountsSubscribe } from '@polkadot/extension-dapp';
import { keyring } from '@polkadot/ui-keyring';

export default async function initializeKeyring() {
    console.log("[initializeKeyring] initializeKeyring started");
    try {
        const injectedExtensions = await web3Enable('bagpipes');
        console.log("[initializeKeyring] web3Enable called");
        
        if (injectedExtensions.length === 0) {
            throw new Error('No extension found');
        }
        
        const allAccounts = await web3Accounts();
        console.log("[initializeKeyring] web3Accounts called", allAccounts);
        
        keyring.loadAll({
            isDevelopment: true,
            ss58Format: 42,
            type: 'ed25519',
            getInjected: () => {
                const accounts = [];
                injectedExtensions.forEach(({ accounts: { get } }) => {
                    accounts.push(...get());
                });
                return accounts;
            }
        });
        console.log("[initializeKeyring] keyring loaded");


        let unsubscribe = await web3AccountsSubscribe(( injectedAccounts ) => { 
            injectedAccounts.map(( account ) => {
                console.log(account.address);
            })
        });
        console.log("[initializeKeyring] subscribed to account changes");
        return unsubscribe; // consider returning this to caller to handle unsubscribing
        

    } catch (error) {
        console.error("Error initializing keyring:", error);
        throw error; // re-throwing error for further handling by caller
    }
}
