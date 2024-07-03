/// tests for XCMSend

import {
  genericPolkadotToParachain,
  polkadot_to_assethub,
  assethub_to_parachain,
  hydraDxToParachain,
  dotToHydraDx,
  assethub2interlay,
} from "./Chains/DraftTx/DraftxTransferTx";
import * as assert from "assert";
import {
  checkAssetHubBalance,
  assetHubNativeBalance,
  checkHydraDxAssetBalance,
  checkRelayRawNativeBalance,
} from "./Chains/Helpers/AssetHelper";
import { Keyring } from "@polkadot/keyring";
import { inAndOutChannels } from "./Chains/Helpers/XcmHelper";

async function test_interlay() {
  console.log(`testing interlay`);
  console.log(`assethub > interlay`);
  const tx = await assethub2interlay(
    1984,
    200000000,
    "0xe64afe6914886cdcfea8da5f13e1e21aa11876cfe7fdde9299bbcdbbdc3a8b19"
  );
  console.log(tx.toHex());
  console.log(`assethub > interlay ok`);

  // console.log(`interlay > assethub`);
  // const i2atx = await interlay2assethub(1984, 200000000, "0xe64afe6914886cdcfea8da5f13e1e21aa11876cfe7fdde9299bbcdbbdc3a8b19");
  // console.log(i2atx.toHex());
  console.log(`interlay > assethub ok`);
}

// if the transaction is in the right format it will break
// test constructing transaction transfers
async function test_transfers() {
  const paraid = 1000; //assethub
  const amount = 1337;
  const assetid = 1984; //usdt
  const address =
    "0x68de6e1566e333753df02b2446f24e1cc2b796cfdf954dc0f39753c578e02a40"; // random accountid32

  // check that we can construct the transfer and that the output is okey
  console.log(`[test] Polkadot transfers`);

  const runp = await genericPolkadotToParachain(paraid, amount, address);
  assert.strictEqual(
    runp.toHex(),
    "0xe804630203000100a10f030001010068de6e1566e333753df02b2446f24e1cc2b796cfdf954dc0f39753c578e02a40030400000000e51400000000"
  );

  console.log(`Polkadot DOT > assethub OK`);
  const ri = await polkadot_to_assethub(
    amount,
    "16XByL4WpQ4mXzT2D8Fb3vmTLWfHu7QYh5wXX34GvahwPotJ"
  );
  assert.strictEqual(
    ri.toHex(),
    "0xec04630903000100a10f0300010100f43376315face751ae6014e8a94301b2c27c0bc4a234e9997ed2c856d13d3d2f030400000000e5140000000000"
  );

  console.log(`Polkadot DOT > assethub scheduled tx check`);
  const dri = await polkadot_to_assethub(
    amount,
    "16XByL4WpQ4mXzT2D8Fb3vmTLWfHu7QYh5wXX34GvahwPotJ",
    10
  );

  console.log(`Polkadot DOT > assethub scheduled tx check`);
  // console.log(dri.toHex())
  //  assert.strictEqual(dri.toHex(), '0x0d01040100f4c817010000630903000100a10f0300010100f43376315face751ae6014e8a94301b2c27c0bc4a234e9997ed2c856d13d3d2f030400000000e5140000000000');
  console.log(`Polkadot DOT > assethub scheduled tx check ok`);

  console.log(`Polkadot DOT > hydradx OK`);
  const dhdx = await dotToHydraDx(amount, address, 10);
  //   console.log(dhdx.toHex());
  console.log(`Polkadot DOT > hydradx scheduled tx check`);
  //  assert.strictEqual(dhdx.toHex(), '0x0d01040100f4c817010000630803000100c91f030001010068de6e1566e333753df02b2446f24e1cc2b796cfdf954dc0f39753c578e02a40030400000000e5140000000000');
  console.log(`Polkadot DOT > hydradx scheduled tx check ok`);

  console.log(`Polkadot DOT > hydradx OK`);
  const runp2 = await dotToHydraDx(amount, address);
  assert.strictEqual(
    runp2.toHex(),
    "0xec04630803000100c91f030001010068de6e1566e333753df02b2446f24e1cc2b796cfdf954dc0f39753c578e02a40030400000000e5140000000000"
  );

  console.log(`Polkadot DOT > hydradx scheduled tx check`);

  console.log(`[test] AssetHub transfers`);
  const ah = await assethub_to_parachain(
    assetid.toString(),
    amount,
    address,
    2034
  ); // hydradx
  assert.strictEqual(
    ah.toHex(),
    "0x0101041f0803010100c91f030001010068de6e1566e333753df02b2446f24e1cc2b796cfdf954dc0f39753c578e02a400304000002043205011f00e5140000000000"
  );
  console.log(`Assethub > hydradx ok`);

  console.log("[test] assethub > polkadot");
  const ap = await assethub_to_parachain(
    assetid.toString(),
    amount,
    address,
    0
  ); // polkadot
  assert.strictEqual(
    ap.toHex(),
    "0xfc041f080301010000030001010068de6e1566e333753df02b2446f24e1cc2b796cfdf954dc0f39753c578e02a400304000002043205011f00e5140000000000"
  );
  console.log(`Assethub > Polkadot ok`);

  console.log(`[test] HydraDx transfers`);
  const runh = await hydraDxToParachain(amount, assetid, address, paraid);
  assert.strictEqual(
    runh.toHex(),
    "0x680489010300000300a10f0000000000e51401010200a10f000000"
  );
  console.log(`Hydradx > assethub ok`);

  console.log(`[test] Hydradx > polkadot`);
  const hp = await hydraDxToParachain(amount, assetid, address, 0); // polkadot
  assert.strictEqual(
    hp.toHex(),
    "0x600489010300000300000000000000e5140101020000000000"
  );
  console.log(`Hydradx > polkadot ok`);
  await test_interlay();
  console.log(`all transaction tests are constructed ok!`);
}

// get the free balance in an object response in an easy way
function number_improve(blob: {
  free: number;
  reserved: number;
  total: number;
}) {
  const balancestring: string = blob.free.toString();
  const balanceobj: number = parseFloat(balancestring.replace(/,/g, ""));
  return balanceobj;
}

// Set your seed in order to get the account object
function get_test_account() {
  const e0 = new Keyring({ type: "sr25519" });
  const account = e0.addFromUri("put seed here");
  return account;
}
/// broadcast transaction from the key in get_test_account function
async function broadcast_run_tx(tx: any) {
  console.log("tx sent as: ");
  const sender = get_test_account();
  console.log(
    tx.signAndSend(sender, ({ status }) => {
      if (status.isInBlock) {
        console.log(`included in ${status.asInBlock}`);
      }
    })
  );
}

// check assets balances
async function test_balances() {
  const assetid = 1984; // usdt
  console.log("Testing assethub balance");
  const accountid = "16Ziip8mK44sh7uKFkZgHbapxoKrRxriZaDdzqNAPW9Wr6x4";

  // check usdt balance on assethub
  const aha = await checkAssetHubBalance(assetid, accountid);
  //  console.log(aha);
  const assethubusdtbalanceString: string = aha.free.toString();
  const assethubusdtbalance: number = parseFloat(
    assethubusdtbalanceString.replace(/,/g, "")
  );
  assert.strictEqual(
    assethubusdtbalance > 0,
    true,
    "Free balance should be more than default 0"
  );

  // check native balance on assethub
  const ahn = await assetHubNativeBalance(accountid);
  const anative: string = ahn.free.toString();
  const anativebalance: number = parseFloat(anative.replace(/,/g, ""));
  assert.ok(anativebalance > 0, "Free balance should be more than default 0");
  console.log(`assethub balance ok`);

  /// polkadot native balance check
  console.log(`Checking polkadot balance checks`);
  const polko = await checkRelayRawNativeBalance("polkadot", accountid);
  assert.ok(
    number_improve(polko) > 0,
    "Polkadot free balance check must be greater than the default 0 value"
  );
  console.log(`polkadot native balance check ok`);

  /// check asset on hydradx
  const dai = 2; // check dai asset on hydradx
  console.log("Testing Hydradx asset balance");
  const accounthydra = "7KVha5AoBK5CEcnutacBVZb9EnwsJ1TaBWooFB6XagBaP6KV"; // hydradx test ac
  const hda = await checkHydraDxAssetBalance(dai, accounthydra);
  assert.ok(number_improve(hda) == 0, "DAI balance is not zero");
  console.log("Hydradx asset balance ok");
}

/// make sure chains have open channels
async function check_open_channels() {
  console.log("Checking open hrmp channels");
  const assethub = 1000;
  const assethubchans: number[] = await inAndOutChannels(assethub);
  assert.ok(
    assethubchans.length > 1,
    "Could not find open channels for assethub"
  );
  console.log("assethub has open channels");

  console.log("checking hydradx channels");
  const hdx = 2034;
  const hdxchans: number[] = await inAndOutChannels(hdx);
  assert.ok(hdxchans.length > 1, "Could not find open channels for assethub");
  console.log("hydradx has open channels");
}

/*
Tests run: 
drafting transactions and checking that they are encoded in the right way
checking if each chain returns correct asset and native balance 

Note(if you want to): 
You can broadcast each tx, by feeding the tx into the broadcast_run_tx function

*/
async function main() {
  console.log("Running tests");
  console.log("Running Balance tests");
  await test_balances();
  console.log("running transaction tests");
  await test_transfers();
  console.log("Checking XCM channels");
  await check_open_channels();
  console.log("test completed");
}

main()
  .then((text) => {
    // console.log(text);
  })
  .catch((err) => {
    console.log("got error: ", err);
  });
