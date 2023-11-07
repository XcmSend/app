
//import { decodeAddress } from '@polkadot/util-crypto';
import { blake2AsU8a, decodeAddress } from '@polkadot/util-crypto'
import { hexToU8a, isHex, u8aToHex } from "@polkadot/util";

import endpoints from "../api/WsEndpoints";
import { ChainInfo, listChains } from "../ChainsInfo";
import connectToWsEndpoint from "../api/connect";
import { CHAIN_METADATA } from "../api/metadata";
import toast, { Toaster } from 'react-hot-toast';
//import { createType } from '@polkadot/types';

import Keyring from "@polkadot/keyring";

function raw_address_now(ss58: string) {
		const keyring = new Keyring();
		const address = u8aToHex(keyring.decodeAddress(ss58));
		return address;
}

export function getRawAddress(ss58Address: string): Uint8Array {
    try {
		
        return decodeAddress(ss58Address);
    } catch (e) {
        throw new Error("Invalid SS58 address format.");
    }
}


// working: https://polkadot.subscan.io/xcm_message/polkadot-6cff92a4178a7bf397617201e13f00c4da124981
/// ref: https://polkaholic.io/tx/0x47914429bcf15b47f4d202d74172e5fbe876c5ac8b8a968f1db44377906f6654
/// DOT to assethub
export async function polkadot_to_assethub(amount: number, address: string) {
	const api = await connectToWsEndpoint('polkadot');
	const paraid = 1000;
  const accountId = api.createType("AccountId32", address).toHex();

	//console.log(`Connected to assethub`);
	const destination = {
		parents: 0,
		interior: { X1: { Parachain: paraid } },
	};

	const account = {
		parents: 0,
		interior: { X1: { AccountId32: { id: accountId, network: null } } },
	};

	const asset = [
		{
			id: { Concrete: { parents: 0, interior: "Here" } },
			fun: { Fungible: amount },
		},
	];


	const tx = await api.tx.xcmPallet.limitedTeleportAssets(
		{ V3: destination },
		{ V3: account	 },
		{ V3: asset },
		{ fee_asset_item: 0},
		{ Unlimited: 0 },

	);

	return tx;
}


function number_to_string(input: number): number {
	console.log(`number_to_string: `, input);
	const numberWithCommas = input.toString();
	const numberWithNoCommas = numberWithCommas.replace(/,/g, ''); // Remove the commas
	console.log(`number_to_string numberWithNoCommas: `, numberWithNoCommas);
// Using parseInt to convert to an integer
	const integerNumber = parseInt(numberWithNoCommas, 10); // The second argument (10) specifies the base (decimal) for parsing.
	console.log(`number_to_string integerNumber: `, integerNumber);

	return integerNumber;
}

// https://assethub-polkadot.subscan.io/extrinsic/4929110-2
export async function assethub2interlay(assetid: number, amount: number, destaccount: string){
	const paraid = 2032;
	const api = await connectToWsEndpoint('assetHub');
	const accountido = raw_address_now(destaccount);
	console.log(`assetid:`, assetid);
// remove commas in assetid
	
// 

	const destination = {
		parents: 1,
		interior: { X1: { Parachain: paraid } },
	};

	const account = {
		parents: 0,
		interior: { X1: { AccountId32: { id: accountido, network: null } } },
	};

	const asset = {
		id: {
			Concrete: {
				parents: 0,
				interior: {
					X2: [
						{ PalletInstance: 50 },
						{ GeneralIndex: number_to_string(assetid).toString() },
					],
				},
			},
		},
		fun: { Fungible: number_to_string(amount).toString() },

	};

	console.log(`asset: `, asset);

	const tx = api.tx.polkadotXcm.limitedReserveTransferAssets(
		{ V2: destination },
		{ V2: account },
		{ V2: [asset] },
		0,
		{ Unlimited: null }
	);

		return tx;
}


/// amount of blocks to delay for
export async function polkadot_schedule(tx: any, blocks: number){
	const api = await connectToWsEndpoint('polkadot');
	let callback = api.tx.system.remark('hello from xcmsend');
	// futureblock = amount of user submited blocks + current latest block nr
	const future: number = await api.query.system.number() + blocks;
	const txo = await api.tx.scheduler.schedule(
		future, 
		0,
		callback

	);
	return txo;
}




// not working
// https://polkaholic.io/tx/0xaa4ccd2b190b9c96d60068ef418860a99b1cea6c220c726284712c081b90766d
export async function interlay2assethub(assetid: number, amount: number, accountid32: string){
	const api = await connectToWsEndpoint('interlay');	
	const paraid = 1000;
	const currency_id = {
		"foreignasset": assetid
	};
	const dest_weight_limit = {
        "unlimited": null
    };

	const destination = {
		parents: 0,
		interior: { x2: [{ Parachain: paraid, accountId32: {
			network: null,
			id: accountid32
		} }] },
	};

	const tx = await api.tx.xTokens.transfer(
		{ "foreignasset": assetid },
		{ amount: amount.toString() },
		{ V3: destination },
		{ unlimited: null },

	);
		return tx;
}



/// Send DOT to a parachain
export async function genericPolkadotToParachain(paraid: number, amount: number, address: string) {
	const api = await connectToWsEndpoint('polkadot');
	//const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	const accountId = api.createType("AccountId32", address).toHex();
	

	const destination = {
	  parents: 0,
	  interior: { X1: { Parachain: paraid } },
	};


	const account = {
	  parents: 0,
	  interior: { X1: { AccountId32: { id: accountId} } },
	};


	const asset = [
	  {
		id: { Concrete: { parents: 0, interior: "Here" } },
		fun: { Fungible: amount },
	  },
	];


	const tx = api.tx.xcmPallet.reserveTransferAssets(
        { V3: destination },
        { V3: account },
        { V3: asset },
        0,
      );

	return tx;
}

// working: https://hydradx.subscan.io/xcm_message/polkadot-047344414db62b7c424c8de9037c5a99edd0794c
export async function dotToHydraDx(amount: number, targetAddress: string){
    const paraid = 2034; // TODO: call from ChainInfo
	let api: any;
	try {
        api = await connectToWsEndpoint('polkadot');
    } catch (error) {
        // If there's an error connecting, send a toast message and terminate the function
        toast.error("Failed to connect to the endpoint. Please ensure you're connected and try again.");
        return; 
    }
 //   console.log(`drafting dot to hydradx`);

	const rawTargetAddress = getRawAddress(targetAddress);


    const destination = {
        parents: 0,
        interior: { 
            X1: { 
                Parachain: paraid 
            } 
        },
    };

    const targetAccount = {
        parents: 0,
        interior: { 
            X1: { 
                AccountId32: { 
                    id: rawTargetAddress 
                } 
            } 
        }
    };

    const asset = [
        {
            id: { Concrete: { parents: 0, interior: "Here" } },
            fun: { Fungible: amount },
        }
    ];

    const tx = api.tx.xcmPallet.limitedReserveTransferAssets(
        { V3: destination },
        { V3: targetAccount },
        { V3: asset },
        0,
		{ Unlimited: null }  // weight_limit

    );
 //   console.log(`[dotTohydraDx] tx created!`);
 //   console.log("[dotTohydraDx] tx to hex", tx.toHex());
    //console.log("[dotTohydraDx] tx to human", tx.toHuman());
    //console.log("[dotTohydraDx] tx", tx);

    return tx;
}



export async function dotToParachain(amount: number,  targetAddress: string){
  const paraid = 1000;
	const api = await connectToWsEndpoint('polkadot');
//	console.log(`sending dot to parachain`);

  const rawTargetAddress = getRawAddress(targetAddress);

	// const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	// const accountId = api.createType("account_id_32", address).toHex(); // convert account to public key

	const destination = {
	  parents: 0,
	  interior: { X1: { Parachain: paraid } },
	};


	const targetAccount = {
	  parents: 0,
	  interior: { X1: { AccountId32: { id: rawTargetAddress} } },
	};


	const asset = [
	  {
		id: { Concrete: { parents: 0, interior: "Here" } },
		fun: { Fungible: amount },
	  },
	];

  const tx = api.tx.xcmPallet.limitedReserveTransferAssets(
    { V3: destination },
    { V3: targetAccount },
    { V3: asset },
    0,
{ Unlimited: null }  // weight_limit
  );
//	console.log(`tx created!`);
//	console.log(tx.toHex());
	return tx;
}




// ref: https://hydradx.subscan.io/extrinsic/3330338-2?event=3330338-7
// dry run results: https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.hydradx.cloud#/extrinsics/decode and input this: 0x640489010300000300a10f00000000002801010200a10f000000
// HYDRADX > parachain
export async function hydraDxToParachain(amount: number, assetId: number, destAccount: string, paraId: number) {
	const api = await connectToWsEndpoint('hydraDx');


// 	console.log(`[hydradx to parachain]amount :`, amount);
// 	console.log(`[hydradx to parachain]assetId :`, assetId);
// 	console.log(`[hydradx to parachain]destAccount :`, destAccount);
	// console.log(`[hydradx to parachain]paraId :`, paraId);
	

    const asset = {
        fun: {
            Fungible: amount, 
        },
        id: {
            Concrete: {
            interior: {
                X3: [
                { Parachain: paraId, PalletInstance: 50, GeneralIndex: assetId }],
                parents: 1, 
            },
            },
        },
    };

    const destination = {
        parents: 1,
        interior: { X2: [{ Parachain: paraId, AccountId32: destAccount, network: null }] },
    };

    const tx = api.tx.xTokens.transferMultiasset(
        { V3: asset },
        { V2: destination },
        { Unlimited: 0 },

    );

	return tx;
}

function uint8ArrayToHex(uint8Array: Uint8Array): string {
	let hex = '';
	for (let i = 0; i < uint8Array.length; i++) {
	  const byte = uint8Array[i];
	  // Use the toString(16) method to convert each byte to a hexadecimal string.
	  // Ensure that the resulting string has two characters by using padStart.
	  hex += byte.toString(16).padStart(2, '0');
	}
	return hex;
  }


/// assethub > hydra
export async function assethub_to_hydra(assetid: number, amount: number, accountId: string) {
	console.log(`[assethub_to_hydra]`);
	const api = await connectToWsEndpoint('assetHub');
	const paraid = 2034;//hydradx
	const accountid = raw_address_now(accountId);//uint8ArrayToHex(blake2(getRawAddress(accountid)).map((x, i): number => (x + 256 - ZERO[i]) % 256));
	const destination = {
		interior: { X1: { Parachain: paraid } },
		parents: 1,
	};

	const account = {
		parents: 0,
		interior: { X1: { AccountId32: { id: accountid } } },
	};

	const asset = {
		id: {
			Concrete: {
				parents: 0,
				interior: {
					X2: [
						{ PalletInstance: 50 },
						{ GeneralIndex: assetid },
					],
				},
			},
		},
		fun: { Fungible: amount },
		parents: 0,
	};
	//];

	const tx = api.tx.polkadotXcm.limitedReserveTransferAssets(
		{ V3: destination },
		{ V3: account },
		{ V3: [asset] },
		0,
		{ Unlimited: 0 }
	);
	return tx;
}





/// assethub > parachain, send an asset on assethub to receiving parachain
export async function assethub_to_parachain(assetid: string, amount: number, accountid: string, paraid: number) {

	//console.log(`assethub_to_parachain]amount :`, amount);
	//console.log(`[assethub_to_parachain]assetId :`, assetid);
	//console.log(`[assethub_to_parachain]paraId :`, paraid);
	
	const api = await connectToWsEndpoint('assetHub');

//	const blake2 = (value: Uint8Array): Uint8Array => blake2AsU8a(value, 512);
//	const ZERO = blake2(new Uint8Array(32))
	
	const accountId = raw_address_now(accountid);//uint8ArrayToHex(blake2(getRawAddress(accountid)).map((x, i): number => (x + 256 - ZERO[i]) % 256));

	//console.log(`[assethub_to_parachain]destAccount :`, accountId);
	//console.log(`[assethub_to_parachain]`);

	//const paraid = 2034;//hydradx
	//const accountid = "0xca477d2ed3c433806a8ce7969c5a1890187d765ab8080d3793b49b42aa9e805f";
	const destination = {
		interior: { X1: { Parachain: paraid } },
		parents: 1,
	  };
	
	  const account = {
		parents: 0,
		interior: { X1: { AccountId32: { id: accountId} } },
	  };

	  const asset =	{
		id: {
            Concrete: {
              parents: 0,
              interior: {
                X2: [
                  { PalletInstance: 50 },
                  { GeneralIndex: assetid },
                ],
              },
            },
          },
		fun: { Fungible: amount },
		 parents: 0,
		};
	  //];

	const tx = api.tx.polkadotXcm.limitedReserveTransferAssets(
		{ V3: destination},
		{ V3: account},
		{ V3: [asset]},
		0,
		{ Unlimited: 0 }
	);
	return tx;
}

