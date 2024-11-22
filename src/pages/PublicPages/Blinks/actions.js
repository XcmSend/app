export const chainActions = [
    { label: 'Transfer', value: 'transfer' },
    { label: 'Stake (coming soon)', value: 'stake' },
    { label: 'Mint (coming soon)', value: 'mint' },
    { label: 'Delegate (coming soon)', value: 'delegate' },
    { label: 'Vote (coming soon)', value: 'vote' },
    { label: 'Claim (coming soon)', value: 'claim' }
];



  export const actionSubmittableStructure = (actionType, params) => {
    console.log('actionSubmittableStructure params', params);
    const structures = {
      transfer: {
        method: "transferKeepAlive",
        section: "balances",
        arguments: [
          { Id: params.recipientId },
          params.transferAmountU128,
        ]
      },
      stake: {
        method: "bond",
        section: "staking",
        arguments: [
          params.amountStakedU128,
          { "Account": params.AccountIdLookUpOf },
        ]
      },
      delegate: {
        method: "delegate",
        section: "convictionVoting",
        arguments: [
          params.classU16,
          { Id: params.recipientId },
          params.convictionEnum,
          params.amountDelegatedU128
        ]
      },
      vote: {
        method: "vote",
        section: "convictionVoting",
        arguments: [
          params.pollIndexU32,
          {
            vote: {
              "vote": {
                "conviction": params.convictionEnum,
                "vote": params.vote
              },
              "balance": params.votingAmountU128
            }
          }
        ]
      }
    };
  
    return structures[actionType]; 
  };
  

  

   export const actionCallsData = {
        transfer: {
          method: "transferKeepAlive",
          section: "balances",
          args: [
            { key: 'recipientId', type: 'AccountId', label: 'Recipient AccountId', userEditable: false },
            { key: 'transferAmountU128', type: 'u128', label: 'Amount', userEditable: true, createPresets: true }
          ]
        },
        stake: {
          method: "bond",
          section: "staking",
          args: [
            { key: 'amountStakedU128', type: 'u128', label: 'Amount Staked' , userEditable: true },
            { key: 'AccountIdLookUpOf', type: 'AccountId', label: 'AccountId', userEditable: false }
          ]
        },
        delegate: {
          method: "delegate",
          section: "convictionVoting",
          args: [
            { key: 'classU16', type: 'u16', label: 'Class', userEditable: false, info: 'The class is the track you will delegate to. E.g. MediumSpender is class TODO: review' },
            { key: 'recipientId', type: 'AccountId', label: 'Recipient AccountId', userEditable: false },
            { key: 'convictionEnum', type: 'enum', label: 'Conviction', userEditable: true, options: ['None', 'Locked1x', 'Locked2x', 'Locked3x', 'Locked4x', 'Locked5x', 'Locked6x'] },
            { key: 'amountDelegatedU128', type: 'u128', label: 'Amount Delegated', userEditable: true }
          ]
        },
        vote: {
          method: "vote",
          section: "convictionVoting",
          args: [
            { key: 'pollIndexU32', type: 'u32', label: 'Poll Index', userEditable: false },
            { key: 'voteType', type: 'enum', label: 'Vote Type', options: ['Standard', 'Split', 'SplitAbstain'], userEditable: true },
            { key: 'conviction', type: 'enum', label: 'Conviction', options: ['None', 'Locked1x', 'Locked2x', 'Locked3x', 'Locked4x', 'Locked5x', 'Locked6x'], userEditable: true },
            { key: 'vote', type: 'bool', label: 'Vote', options: ['Aye', 'Nay'], userEditable: true },
            { key: 'votingAmountU128', type: 'u128', label: 'Voting Amount', userEditable: true }
          ]
        }
      };
      

      const argInfo = {
    
      }

    // export  const actionCreatorOptions = {
    //     // we wan to look at the action configs and add further specification to actionConfigs, as some fields require custom selection by the user, for example transferAmountU128 can be preset buttons and also a custom input field. 
    //     transfer: {
    //         transferAmountU128: {
    //             createPresets: true,
    //             options: [
    //                 fixedInput: {
    //                     label: string,
    //                     value: type,
    //                 },
    //                 inputAmount: {
    //                     label: string,
    //                     value: type,
    //                 },

    //         }
    //     },
    // }


      


    
  // Substrate based chains call
  // transfer is the balance transfer keep alive action
//   const actionCalls = {
//     transfer:  api.tx.balances.transferKeepAlive,
//     stake: api.tx.staking.stake,
//     noAction: null,
//     mint: api.tx.balances.mint,
//     claim: api.tx.staking.claim,
//     delegate: api.tx.staking.delegate,
//     vote: api.tx.democracy.vote,
//   }

    // what we need to do is hard code some of the values and keep the rest dynamic for inputting by the user 
    // so for exammple transferKeepAlive has 3 parameters: AccountIdLookUpOf

  // export const actionSubmittableStructure = {
  //  transfer: {
  //       method: "transferKeepAlive",
  //       section: "balances",
  //       arguments: [
  //         {
  //           Id: recipientId,
  //         },
  //         amountU128,
  //       ]
  //     },
  //   stake: 
  //     {
  //       method: "bond",
  //       section: "staking",
  //       arguments: [
  //           amountStakedU128,
  //       {
  //       "Account": AccountIdLookUpOf,
  //       }
  // ]

  //     },
  //     delegate: {
  //       method: "delegate",
  //       section: "convictionVoting",
  //       arguments: [
  //         classU16, // input
  //         {
  //           Id: recipientId // input
  //         },
  //        convictionEnum, // input None, Locked1x, Locked2x, Locked3x, Locked4x, Locked5x, Locked6x
  //         amountDelegatedU128 // input
  //       ]
  //     },
  //    vote:
  //       {
  //       method: "vote",
  //       section: "convictionVoting",
  //       arguments: [
  //           pollIndexU32, // input
  //           {
  //           vote: { // input Standard, Split, SplitAbstain 
  //               "vote": {
  //               "conviction": convictionEnum, // input None, Locked1x, Locked2x, Locked3x, Locked4x, Locked5x, Locked6x
  //               "vote": vote // Aye or Nay (bool) input
  //               },
  //               "balance": votingAmountU128 // input
  //           }
  //           }
  //       ]
  //       }
      
  //   }