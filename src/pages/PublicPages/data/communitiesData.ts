import { Community } from '../types';
import { hashtags } from './hashtagsData';


export const communities: Community[] = [
  {
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
              links: [{ title: "Sketch", url: "https://sketch.com/polkadot-ui2" }]
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
        logo: "/chains/turing.png",
        title: "Ava Protocol",
        name: "Ava",
        description: "Ava Protocol provides intelligent automation and enhanced privacy features for blockchain transactions.",
        url: "https://avaprotocol.org/",
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
              description: "A template for creating Moonbeam Moonbeam workflows using Bagpipes.",
              // workflowOrderedList: ["Step 1", "Step 2", "Step 3"],
              links: [{ title: "GitHub", url: "https://github.com/" }]
            },
            {
              id: "moonbeam-bagpipes-2",

              title: "Moonbeam Bagpipes Template 2",
              description: "Another template for creating Moonbeam workflows using Bagpipes.",
              // workflowOrderedList: ["Step A", "Step B", "Step C"],
              links: [{ title: "Documentation", url: "https://moonbeam.network/docs" }]
            }
          ],
          ui: [
            {
              id: "moonbeam-bagpipes-3",

              title: "Moonbeam  UI Template 1",
              description: "(Coming soon) A UI template for Polkadot-based projects.",
              image: "/images/polkadot-ui1.png",
              links: [{ title: "Figma", url: "https://figma.com/polkadot-ui1" }]
            },
            {
              id: "moonbeam-bagpipes-4",

              title: "Moonbeam  UI Template 2",
              description: " (Coming soon) Another UI template for Moonbeam-based projects.",
              image: "/images/Moonbeam-ui2.png",
              links: [{ title: "Sketch", url: "https://sketch.com/polkadot-ui2" }]
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
          { feature: "Ethereum Compatibility", description: "Full compatibility with Ethereum tools and network." },
          { feature: "Cross-Chain Integration", description: "Integrate with other blockchains in the Polkadot ecosystem." },
          { feature: "Scalable Smart Contracts", description: "Deploy scalable and interoperable smart contracts on Polkadot." },
          { feature: "Decentralized Governance", description: "Community-driven governance model for network upgrades and management." },
        ],
      },
      {
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
              links: [{ title: "Figma", url: "https://figma.com/polkadot-ui1" }]
            },
            {
              id: "hydrax-bagpipes-4",
              title: "Polkadot UI Template 2",
              description: " (Coming soon) Another UI template for Polkadot-based projects.",
              image: "/images/polkadot-ui2.png",
              links: [{ title: "Sketch", url: "https://sketch.com/polkadot-ui2" }]
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
      }
    ];

