import { WellKnownChain, createScClient } from "@substrate/connect";
// Create the client
const client = createScClient();
// Create the chain connection, while passing the `jsonRpcCallback` function.
const chain = await client.addWellKnownChain(WellKnownChain.polkadot, function jsonRpcCallback(response) {
  console.log("response", response);
});
// send a RpcRequest
chain.sendJsonRpc('{"jsonrpc":"2.0","id":"1","method":"system_health","params":[]}');