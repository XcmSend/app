export const chainOptions = [
    {
      value: 'polkadot',
      label: 'Polkadot',
      logo: './polkadot-logo.svg',
    },
    {
      value: 'rococo',
      label: 'Rococo',
      logo: './polkadot-logo.svg'
    },
    {
      value: 'hydraDx',
      label: 'Hydra',
      logo: './hydra-logo.svg'
    },
    {
      value: 'assetHub',
      label: 'Asset Hub',
      logo: './assethub-logo.svg'
    },
  ];


  export const assetOptions = [
    {
      chain: 'polkadot',
      assets: [
        {
          value: 'polkadotDot',
          ticker: 'DOT',
          description: 'Polkadot'
        }
      ]
    },
    {
      chain: 'rococo',
      assets: [
        {
          value: 'rococoRoc',
          ticker: 'ROC',
          description: 'Rococo'
        }
      ]
    },
    {
      chain: 'hydraDx',
      assets: [
        {
          value: 'hydraHdx',
          ticker: 'HDX',
          description: 'HDX',

        },
        {
          value: 'hydraUsdt',
          ticker: 'USDt',
          description: 'Polkadot Asset Hub'

        },
        {
          value: 'hydraDot',
          ticker: 'DOT',
          description: 'Polkadot'
        }
      ]
    },
    {
      chain: 'assetHub',
      assets: [
        {
          value: 'assetHubUsdt',
          ticker: 'USDt',
          description: 'Tether'
        },
        {
          value: 'assetHubDot',
          ticker: 'DOT',
          description: 'Asset Hub\'s DOT'
        }
      ]
    }
  ];

