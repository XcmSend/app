
import endpoints from "../WsEndpoints";
import { ChainInfo, listChains } from "../ChainsInfo";
import connectToWsEndpoint from "../connect";
import { CHAIN_METADATA } from "../metadata";


/// Send DOT to a parachain
export async function genericPolkadotToParachain(paraid: number, amount: number, address: string) {
	const api = await connectToWsEndpoint('polkadot');
	//const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	const accountId = api.createType("account_id_32", address).toHex();

	const destination = {
	  parents: 0,
	  interior: { X1: { Parachain: paraid } },
	};


	const account = {
	  parents: 0,
	  interior: { X1: { account_id_32: { id: accountId} } },
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
export async function dotToHydraDx(amount: number,  address: string){
	const paraid = 2034; // TODO: call from ChainInfo
	const api = await connectToWsEndpoint('polkadot');
	console.log(`sending dot to hydradx`);
	// const address = "12u9Ha4PxyyQPvJgq3BghnqNXDwLqTnnJFuXV7aZQoiregT2";
	const accountId = api.createType("account_id_32", address).toHex();

	const destination = {
	  parents: 0,
	  interior: { X1: { Parachain: paraid } },
	};


	const account = {
	  parents: 0,
	  interior: { X1: { account_id_32: { id: accountId} } },
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
	console.log(`tx created!`);
	console.log(tx.toHex());
	return tx;
}

// call await signAndSend()


// ref: https://hydradx.subscan.io/extrinsic/3330338-2?event=3330338-7
// dry run results: https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.hydradx.cloud#/extrinsics/decode and input this: 0x640489010300000300a10f00000000002801010200a10f000000
// HYDRADX > parachain
export async function hydraDxToParachain(amount: number, assetId: number, destAccount: string, paraId: number) {
	const api = await connectToWsEndpoint('hydraDx');

	
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

/// tested on assethub > hydradx
/// assethub > parachain, send an asset on assethub to receiving parachain
async function assethub_to_parachain(assetid: string, amount: number, accountid: string, paraid: number) {
	//console.log(`[assethub_to_hydra]`);
	const api = await connectToWsEndpoint(endpoints.polkadot.assetHub);
	//const paraid = 2034;//hydradx
	//const accountid = "0xca477d2ed3c433806a8ce7969c5a1890187d765ab8080d3793b49b42aa9e805f";
	const destination = {
		interior: { X1: { Parachain: paraid } },
		parents: 1,
	  };
	
	  const account = {
		parents: 0,
		interior: { X1: { AccountId32: { id: accountid} } },
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


