// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EvmWalletInfo } from './types';

// @ts-ignore
import MetaMaskLogo from './MetaMaskLogo.svg';
// @ts-ignore
import SubWalletLogo from './SubWalletLogo.svg';
// @ts-ignore
import NovaWalletLogo from './NovaWalletLogo.svg';
// @ts-ignore
import TalismanWalletLogo from './TalismanLogo.svg';

export const PREDEFINED_EVM_WALLETS: EvmWalletInfo[] = [
  {
    extensionName: 'SubWallet',
    title: 'SubWallet (EVM)',
    installUrl: 'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    logo: {
      src: SubWalletLogo as string,
      alt: 'SubWallet (EVM)'
    },
    isSetGlobalString: 'isSubWallet',
    initEvent: 'subwallet#initialized'
  },
  {
    extensionName: 'talisman',
    title: 'Talisman',
    installUrl: 'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
    logo: {
      src: TalismanWalletLogo as string,
      alt: 'Talisman'
    },
    isSetGlobalString: 'isTalisman',
    initEvent: 'talisman#initialized'
  },
  {
    extensionName: 'ethereum',
    title: 'MetaMask',
    installUrl: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    logo: {
      src: MetaMaskLogo as string,
      alt: 'MetaMask Extension'
    },
    isSetGlobalString: 'isMetaMask',
    initEvent: 'metamask#initialized'
  },
  {
    extensionName: 'ethereum',
    title: 'Nova Wallet (EVM)',
    installUrl: 'https://novawallet.io',
    logo: {
      src: NovaWalletLogo as string,
      alt: 'NovaWallet (EVM)'
    },
    isSetGlobalString: 'isNovaWallet',
    initEvent: 'ethereum#initialized'
  }
];
