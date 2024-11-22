import { Community } from '../types';
import { hashtags } from './hashtagsData';


export const communities: Community[] = [
  {
        id: "1",
        logo: "/chains/polkadot.svg",
        title: "Polkadot Network",
        name: "Polkadot",
        description: "Polkadot enables cross-blockchain transfers of any type of data or asset, not just tokens, allowing blockchains to interoperate with each other.",
        url: "https://polkadot.network",
        templates: {
          bagpipes: [
            {
              id: "polkadot-bagpipes-1",
              title: "Polkadot Bagpipes Template 1",
              description: "A template for creating Polkadot projects using Bagpipes.",
              // workflowOrderedList: ["Step 1", "Step 2", "Step 3"],
              links: [{ title: "GitHub", url: "https://github.com/polkadot" }]
            },
            {
              id: "polkadot-bagpipes-2",
              title: "Polkadot Bagpipes Template 2",
              description: "Another template for creating Polkadot projects using Bagpipes.",
              // workflowOrderedList: ["Step A", "Step B", "Step C"],
              links: [{ title: "Documentation", url: "https://polkadot.network/docs" }]
            }
          ],
          ui: [
            {
              id: "polkadot-bagpipes-3",
              title: "Polkadot UI Template 1",
              description: " (Coming soon) A UI template for Polkadot-based projects.",
              image: "/images/polkadot-ui1.png",
              links: [{ title: "Coming Soon", url: "https://figma.com/polkadot-ui1" }]
            },
            {
              id: "polkadot-bagpipes-4",
              title: "Polkadot UI Template 2",
              description: " (Coming soon) Another UI template for Polkadot-based projects.",
              image: "/images/polkadot-ui2.png",
              links: [{ title: "UI2", url: "https://sketch.com/polkadot-ui2" }]
            }
          ]
        },    
        howTos: [
          {
            title: "How to build a blockchain on Polkadot",
            image: "/images/polkadot-howto.png",
            description: "A comprehensive guide to building and connecting a custom blockchain using Substrate and Polkadot."
          }
        ],
        hashTags: ["1", "2", "3", "4"],
        mostActiveCreators: ["1", "2", "3"],         
        features: [
          { feature: "Interoperability", description: "Allows for cross-chain communication and transfer of any type of data or asset." },
          { feature: "Scalability", description: "Economic and transactional scalability via a shared set of validators and parallel transaction processing." },
          { feature: "Security", description: "Pooled security through a novel data availability and validity scheme." },
          { feature: "User-Driven Governance", description: "Transparent on-chain governance where all stakeholders have a voice." },
          { feature: "Energy Efficiency", description: "Low energy consumption with a nominated proof-of-stake (NPoS) model." },
          { feature: "Innovative Consensus", description: "GRANDPA consensus for quick finalization of blocks." },
          { feature: "Cross-Chain Communication", description: "XCM allows secure data and value exchange across different blockchains." },
          { feature: "On-Chain Treasury", description: "Funds decentralized projects benefiting the Polkadot network." },
        ],
      },
      {
        id: "2",
        logo: "/chains/turing.png",
        title: "Ava Protocol",
        name: "Ava",
        description: "Ava Protocol provides intelligent automation and enhanced privacy features for blockchain transactions.",
        url: "https://avaprotocol.org/",
        uiTemplateShowcase: false,
        templates: {
          bagpipes: [
            {
              id: "ava-bagpipes-1",
              title: "Ava Bagpipes Template 1",
              description: "A template for creating Polkadot projects using Bagpipes.",
              // workflowOrderedList: ["Step 1", "Step 2", "Step 3"],
              links: [{ title: "GitHub", url: "https://github.com/avaprotocol" }]
            },
            {
              id: "ava-bagpipes-2",

              title: "Ava Bagpipes Template 2",
              description: "Another template for creating Polkadot projects using Bagpipes.",
              // workflowOrderedList: ["Step A", "Step B", "Step C"],
              links: [{ title: "Documentation", url: "https://avaprotocol.org/docs" }]
            }
          ],
          ui: [
            {
              id: "ava-bagpipes-3",

              title: "Ava DEX tools",
              description: "(Coming soon) Tools for trading on DEXs. ",
              image: "/images/polkadot-ui1.png",
              links: [{ title: "Ava DEX", url: "https://figma.com/polkadot-ui1" }]
            },
            {
              id: "ava-bagpipes-4",

              title: "Ava Web3 Subscriptions",
              description: " (Coming soon) Another UI template for Ava-based projects.",
              image: "/images/polkadot-ui2.png",
              links: [{ title: "Ava Pay", url: "https://sketch.com/polkadot-ui2" }]
            }
          ]
        },    
        howTos: [
          {
            title: "How to build a Dapp on Ava",
            image: "/images/polkadot-howto.png",
            description: "(Example) A comprehensive guide to building and connecting a custom Dapp on Ava."
          }
        ],    
        mostActiveCreators: ["1", "2", "3"],  
        hashTags: ["5", "1", "2", "3"],        
        features: [
          { feature: "Intelligent Automation", description: "Transactions autonomously execute based on predefined conditions, streamlining operations." },
          { feature: "Enhanced Privacy", description: "Advanced MEV (Maximal Extractable Value) protection mechanisms ensure transaction confidentiality, safeguarding against front-running and privacy breaches." },
          { feature: "Composability", description: "Combine smart contract calls effortlessly without writing a single line of code." },
          { feature: "Cost Efficiency", description: "Dramatically reduce transaction costs—experience up to 90% savings on gas fees, making blockchain use more accessible." },
        ],
       

      },
      {
        id: "3",
        logo: "/chains/moonbeam.svg",
        title: "Moonbeam Network",
        name: "Moonbeam",
        description: "Moonbeam is an Ethereum-compatible smart contract parachain on Polkadot that simplifies the process of deploying multi-chain applications.",
        url: "https://moonbeam.network",
        templates: {
          bagpipes: [
            {
              id: "moonbeam-bagpipes-1",
              title: "Moonbeam Bagpipes Template 1",
              description: "A template for creating Moonbeam workflows using Bagpipes.",
              links: [{ title: "GitHub", url: "https://github.com/" }]
            },
            {
              id: "moonbeam-bagpipes-2",
              title: "Moonbeam Bagpipes Template 2",
              description: "Another template for creating Moonbeam workflows using Bagpipes.",
              links: [{ title: "Documentation", url: "https://moonbeam.network/docs" }]
            }
          ],
          ui: [
            {
              id: "moonbeam-ui-1",
              title: "Moonbeam UI Template 1",
              description: "(Coming soon) A UI template for Moonbeam-based projects.",
              image: "/images/moonbeam-ui1.png",
              links: [{ title: "UI1", url: "https://figma.com/moonbeam-ui1" }]
            },
            {
              id: "moonbeam-ui-2",
              title: "Moonbeam UI Template 2",
              description: "(Coming soon) Another UI template for Moonbeam-based projects.",
              image: "/images/moonbeam-ui2.png",
              links: [{ title: "UI2", url: "https://sketch.com/moonbeam-ui2" }]
            }
          ]
        },
        howTos: [
          {
            title: "Moonbeam ↔ Assethub (Polkadot)",
            image: "/img/moonbeamassethub.png",
            description: "Easily transfer assets between Moonbeam and Assethub on the Polkadot network.",
            links: [
              { title: "Create Transfer Workflow", url: "https://alpha.bagpipes.io/#/create/?diagramData=TpHPJ3DEQ" },
              { title: "Assethub Documentation", url: "https://docs.assethub.network/" }
            ]
          },
          {
            title: "Moonbeam ↔ Polkadot Relay Chain",
            image: "/img/moonbeampolkadot.png",
            description: "Facilitate direct asset transfers between Moonbeam and the Polkadot relay chain.",
            links: [
              { title: "Create Transfer Workflow", url: "https://alpha.bagpipes.io/#/create/?diagramData=EqOUByVQP" },
              { title: "Polkadot Relay Chain Docs", url: "https://polkadot.network/documentation/" }
            ]
          },
          {
            title: "Moonbeam ↔ Hydration",
            image: "/img/moonbeamhydra.png",
            description: "Enable seamless asset transfers between Moonbeam and Hydration.",
            links: [
              { title: "Create Transfer Workflow", url: "https://alpha.bagpipes.io/#/create/?diagramData=sPn_LOKiE" },
              { title: "Hydration Documentation", url: "https://docs.hydration.io/" }
            ]
          },
          {
            title: "Supported Assets",
            image: "/img/moonbeamassethub.png",
            description: "Bagpipes supports all XC-20 assets registered on Moonbeam. You can transfer, manage, and query these assets efficiently.",
            links: [
              { title: "View Supported Assets on Moonbeam", url: "https://docs.moonbeam.network/builders/interoperability/xcm/xc20/overview/" }
            ]
          },
          {
            title: "Chain Query",
            image: "/img/moonbeamquery.png",
            description: "Query any storage item in Moonbeam quickly and efficiently using Bagpipes workflows.",
            links: [
              { title: "Chain Query Guide (Bagpipes)", url: "/docs/nodes/chainQuery" }
            ]
          },
          {
            title: "ChainTx",
            image: "/img/moontx.png",
            description: "Conduct transactions seamlessly on the Moonbeam parachain using Bagpipes workflows.",
            links: [
              { title: "Chain Tx Guide (Bagpipes)", url: "/docs/nodes/chainTx" },
              { title: "Talisman Wallet", url: "https://talisman.xyz" },
              { title: "Transaction Guide (Moonbeam)", url: "https://docs.moonbeam.network/getting-started/submit-a-transaction/" }
            ]
          }
        ],
        mostActiveCreators: ["1", "2", "3"],
        hashTags: ["1", "2", "3", "4"],
        features: [
          { feature: "Ethereum Compatibility", description: "Full compatibility with Ethereum tools and network." },
          { feature: "Cross-Chain Integration", description: "Integrate with other blockchains in the Polkadot ecosystem." },
          { feature: "Scalable Smart Contracts", description: "Deploy scalable and interoperable smart contracts on Polkadot." },
          { feature: "Decentralized Governance", description: "Community-driven governance model for network upgrades and management." },
        ],
      },
      
      {
        id: "4",
        logo: "/chains/hydradx.svg",
        title: "HydraDX ",
        name: "HydraDX",
        description: "HydraDX is a decentralized protocol for multi-asset liquidity that integrates seamlessly with the Polkadot ecosystem. Its Omnipool allows for efficient, sustainable, and trustless trading by combining all assets in a single pool.",
        url: "https://hydradx.io",
        templates: {
          bagpipes: [
            {
              id: "hydrax-bagpipes-1",
              title: "HydraDx Bagpipes Template 1",
              description: "A template for creating Hydra Dx workflows using Bagpipes.",
              // workflowOrderedList: ["Step 1", "Step 2", "Step 3"],
              links: [{ title: "GitHub", url: "https://github.com/avaprotocol" }]
            },
            {
              id: "hydrax-bagpipes-2",
              title: "HydraDx Bagpipes Template 2",
              description: "Another template for creating Hydra Dx workflows using Bagpipes.",
              // workflowOrderedList: ["Step A", "Step B", "Step C"],
              links: [{ title: "Documentation", url: "https://hydradx.io/docs" }]
            }
          ],
          ui: [
            {
              id: "hydrax-bagpipes-3",
              title: "HydraDx UI Template 1",
              description: " (Coming soon) A UI template for Polkadot-based projects.",
              image: "/images/polkadot-ui1.png",
              links: [{ title: "UI1", url: "https://figma.com/polkadot-ui1" }]
            },
            {
              id: "hydrax-bagpipes-4",
              title: "Polkadot UI Template 2",
              description: " (Coming soon) Another UI template for Polkadot-based projects.",
              image: "/images/polkadot-ui2.png",
              links: [{ title: "UI2", url: "https://sketch.com/polkadot-ui2" }]
            }
          ]
        },    
        howTos: [
          {
            title: "How to build a blockchain on Polkadot",
            image: "/images/polkadot-howto.png",
            description: "A comprehensive guide to building and connecting a custom blockchain using Substrate and Polkadot."
          }
        ],    
        mostActiveCreators: ["1", "2", "3"], 
        hashTags: ["blockchain", "interoperability", "scalability", "security"],
        features: [
          { feature: "Omnipool", description: "Combines all assets in a single pool for efficient trading with fewer hops and lower slippage." },
          { feature: "Single-Sided Liquidity Provisioning", description: "Allows providing liquidity for only the asset you want." },
          { feature: "DCA Trading", description: "Supports dollar-cost averaging to protect against price volatility." },
          { feature: "Hydrated Farms", description: "Earn additional rewards by providing liquidity for selected assets." },
          { feature: "OTC Trading", description: "Trade assets directly with other traders without slippage." },
          { feature: "State-of-the-Art Security", description: "Fully audited protocol with liquidity caps, protocol fees, and circuit-breakers." },
          { feature: "Decentralized Governance", description: "Community-first approach with democratic decision-making processes." },
          { feature: "Dynamic Fees", description: "Fees that adjust based on market conditions to ensure fairness and stability." }
        ]
      },
      {
        id: "5",
        logo: "/communities/stellaswap.svg",
        title: "StellaSwap",
        name: "StellaSwap",
        description: "StellaSwap is a leading decentralized exchange (DEX) on the Moonbeam parachain network, offering trading, earning, and liquidity solutions for the Polkadot ecosystem.",
        url: "https://stellaswap.com",
        templates: {
          bagpipes: [
            {
              id: "stellaswap-bagpipes-1",
              title: "StellaSwap Bagpipes Template 1",
              description: "A template for creating StellaSwap workflows using Bagpipes.",
              links: [{ title: "GitHub", url: "https://github.com/" }]
            },
            {
              id: "stellaswap-bagpipes-2",
              title: "StellaSwap Bagpipes Template 2",
              description: "Another template for creating StellaSwap workflows using Bagpipes.",
              links: [{ title: "Documentation", url: "https://stellaswap.com/docs" }]
            }
          ],
          ui: [
            {
              id: "stellaswap-ui-1",
              title: "StellaSwap UI Template 1",
              description: "(Coming soon) A UI template for StellaSwap-based projects.",
              image: "/images/stellaswap-ui1.png",
              links: [{ title: "UI1", url: "https://figma.com/stellaswap-ui1" }]
            },
            {
              id: "stellaswap-ui-2",
              title: "StellaSwap UI Template 2",
              description: "(Coming soon) Another UI template for StellaSwap-based projects.",
              image: "/images/stellaswap-ui2.png",
              links: [{ title: "UI2", url: "https://sketch.com/stellaswap-ui2" }]
            }
          ]
        },
        howTos: [
          {
            title: "How to Swap",
            image: "/images/stellaswap-swap.png",
            description: "Guide on how to swap assets on StellaSwap.",
            links: [
              { title: "Learn How to Swap", url: "https://docs.stellaswap.com/how-to-swap" }
            ]
          },
          {
            title: "How to Add Liquidity",
            image: "/images/stellaswap-add-liquidity.png",
            description: "Guide on how to add liquidity to StellaSwap pools.",
            links: [
              { title: "Learn How to Add Liquidity", url: "https://docs.stellaswap.com/how-to-add-liquidity" }
            ]
          },
          {
            title: "How to Farm (Stake LP Token)",
            image: "/images/stellaswap-farm.png",
            description: "Guide on how to stake LP tokens and earn rewards on StellaSwap.",
            links: [
              { title: "Learn How to Farm", url: "https://docs.stellaswap.com/how-to-farm" }
            ]
          },
          {
            title: "How to Bridge Assets to Moonbeam",
            image: "/images/stellaswap-bridge.png",
            description: "Guide on how to bridge assets from various chains to Moonbeam.",
            links: [
              { title: "Learn How to Bridge Assets", url: "https://docs.stellaswap.com/how-to-bridge-assets" }
            ]
          }
        ],
        mostActiveCreators: ["5", "1", "2"],
        hashTags: ["26", "29", "30", "22"],
        features: [
          { feature: "Automated Market Making", description: "Facilitates decentralized trading of assets using an AMM model." },
          { feature: "Yield Farming", description: "Earn rewards by providing liquidity and staking LP tokens." },
          { feature: "Cross-Chain Swaps", description: "Swap assets across different blockchains seamlessly." },
          { feature: "Governance Token (STELLA)", description: "Stake STELLA to participate in protocol governance and earn rewards." },
        ],
      },
      {
        id: "6",
        logo: "/communities/beamswap.jpg",
        title: "Beamswap",
        name: "Beamswap",
        description: "Beamswap is a decentralized exchange (DEX) on the Moonbeam network, providing a comprehensive suite of DeFi tools including yield farming, staking, and liquidity provision.",
        url: "https://beamswap.io",
        templates: {
          bagpipes: [
            {
              id: "beamswap-bagpipes-1",
              title: "Beamswap Bagpipes Template 1",
              description: "A template for creating Beamswap workflows using Bagpipes.",
              links: [{ title: "GitHub", url: "https://github.com/" }]
            },
            {
              id: "beamswap-bagpipes-2",
              title: "Beamswap Bagpipes Template 2",
              description: "Another template for creating Beamswap workflows using Bagpipes.",
              links: [{ title: "Documentation", url: "https://docs.beamswap.io/" }]
            }
          ],
          ui: [
            {
              id: "beamswap-ui-1",
              title: "Beamswap UI Template 1",
              description: "(Coming soon) A UI template for Beamswap-based projects.",
              image: "/images/beamswap-ui1.png",
              links: [{ title: "UI1", url: "https://figma.com/beamswap-ui1" }]
            },
            {
              id: "beamswap-ui-2",
              title: "Beamswap UI Template 2",
              description: "(Coming soon) Another UI template for Beamswap-based projects.",
              image: "/images/beamswap-ui2.png",
              links: [{ title: "UI2", url: "https://sketch.com/beamswap-ui2" }]
            }
          ]
        },
        howTos: [
          {
            title: "How to Swap Tokens",
            image: "/images/beamswap-swap.png",
            description: "Guide on how to swap tokens on Beamswap.",
            links: [
              { title: "Learn How to Swap", url: "https://docs.beamswap.io/how-to-swap-tokens" }
            ]
          },
          {
            title: "How to Add Liquidity",
            image: "/images/beamswap-add-liquidity.png",
            description: "Guide on how to add liquidity to Beamswap pools.",
            links: [
              { title: "Learn How to Add Liquidity", url: "https://docs.beamswap.io/how-to-add-liquidity" }
            ]
          },
          {
            title: "How to Yield Farm",
            image: "/images/beamswap-farm.png",
            description: "Guide on how to stake LP tokens and earn rewards on Beamswap.",
            links: [
              { title: "Learn How to Yield Farm", url: "https://docs.beamswap.io/how-to-yield-farm" }
            ]
          },
          {
            title: "How to Bridge Assets to Moonbeam",
            image: "/images/beamswap-bridge.png",
            description: "Guide on how to bridge assets from various chains to Moonbeam.",
            links: [
              { title: "Learn How to Bridge Assets", url: "https://docs.beamswap.io/bridge" }
            ]
          }
        ],
        mostActiveCreators: ["1", "2", "3"],
        hashTags: ["26", "29", "30", "22"],
        features: [
          { feature: "Automated Market Making (AMM)", description: "Enables decentralized trading of assets using an AMM model." },
          { feature: "Yield Farming", description: "Earn rewards by providing liquidity and staking LP tokens." },
          { feature: "Cross-Chain Swaps", description: "Swap assets across different blockchains seamlessly." },
          { feature: "Governance Token (GLINT)", description: "Stake GLINT to participate in protocol governance and earn rewards." },
          { feature: "Integrated Bridge", description: "Bridge tokens between different EVM chains and the Moonbeam network." }
        ]
      },
      {
        id: "7",
        logo: "/communities/wormhole.svg",
        title: "Wormhole",
        name: "Wormhole",
        description: "Wormhole is a generic message passing protocol that enables communication between blockchains. It connects multiple ecosystems and allows secure data and asset transfers across different chains.",
        url: "https://wormhole.com",
        templates: {
          bagpipes: [
            {
              id: "wormhole-bagpipes-1",
              title: "Wormhole Bagpipes Template 1",
              description: "A template for creating Wormhole workflows using Bagpipes.",
              links: [{ title: "GitHub", url: "https://github.com/" }]
            },
            {
              id: "wormhole-bagpipes-2",
              title: "Wormhole Bagpipes Template 2",
              description: "Another template for creating Wormhole workflows using Bagpipes.",
              links: [{ title: "Documentation", url: "https://docs.wormhole.com/" }]
            }
          ],
          ui: [
            {
              id: "wormhole-ui-1",
              title: "Wormhole UI Template 1",
              description: "(Coming soon) A UI template for Wormhole-based projects.",
              image: "/images/wormhole-ui1.png",
              links: [{ title: "UI1", url: "https://figma.com/wormhole-ui1" }]
            },
            {
              id: "wormhole-ui-2",
              title: "Wormhole UI Template 2",
              description: "(Coming soon) Another UI template for Wormhole-based projects.",
              image: "/images/wormhole-ui2.png",
              links: [{ title: "UI2", url: "https://sketch.com/wormhole-ui2" }]
            }
          ]
        },
        howTos: [
          {
            title: "How to Use Wormhole Connect",
            image: "/images/wormhole-connect.png",
            description: "Guide on how to use Wormhole Connect for bridging assets.",
            links: [
              { title: "Learn How to Use Wormhole Connect", url: "https://docs.wormhole.com/how-to-use-wormhole-connect" }
            ]
          },
          {
            title: "How to Transfer Assets",
            image: "/images/wormhole-transfer.png",
            description: "Guide on how to transfer assets using Wormhole.",
            links: [
              { title: "Learn How to Transfer Assets", url: "https://docs.wormhole.com/how-to-transfer-assets" }
            ]
          },
          {
            title: "How to Stake W Tokens",
            image: "/images/wormhole-stake.png",
            description: "Guide on how to stake W tokens for governance.",
            links: [
              { title: "Learn How to Stake W Tokens", url: "https://docs.wormhole.com/how-to-stake-w-tokens" }
            ]
          }
        ],
        mostActiveCreators: ["1", "2", "3"],
        hashTags: ["1", "2", "4", "20"],
        features: [
          { feature: "Cross-Chain Messaging", description: "Enables communication between different blockchains using signed VAAs." },
          { feature: "Interoperability", description: "Connects multiple blockchain ecosystems for seamless data and asset transfers." },
          { feature: "Decentralized Security", description: "Secured by a network of 19 top validator companies (Guardians)." },
          { feature: "Governance", description: "Stake W tokens to participate in protocol governance and decision-making." },
        ]
      }
      

      
      
    ];

