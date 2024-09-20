import { ApiPromise } from "@polkadot/api";

import { ContractPromise } from "@polkadot/api-contract";

// query a contracts function
export async function query_contract(
  messageName: string,
  params: any[],
  contract_address: string,
  api: any,
  abidata: any,
) {
  const storageDepositLimit = null;
  const abiJson = abidata; //JSON.parse(fs.readFileSync('./src/flipper.json', 'utf8'));

  const contract = new ContractPromise(api, abiJson, contract_address);

  const gasLimit: any = api.registry.createType("WeightV2", {
    refTime: BigInt(10000000000),
    proofSize: BigInt(10000000000),
  });

  const queryResult = await contract.query[messageName](
    //ContractCallOutcome
    contract_address,
    {
      gasLimit,
      storageDepositLimit,
    },
    ...params,
  );

  return queryResult.result;
}

// list all ink contracts on chain
async function get_contracts(api: ApiPromise) {
  const keys = await api.query.contracts.contractInfoOf.keys();
  return keys;
}

async function display_contracts(api: ApiPromise) {
  const keys = await get_contracts(api);
  for (const key of keys) {
    const string_key = key.toHuman()?.toString();
    console.log(`Key: ${string_key}  Raw: ${key}`);
    const storageValue = await api.query.contracts.contractInfoOf(string_key);
    console.log(`Storage Value: ${storageValue}`);
  }
}

interface Message {
  method: string;
  selector: string;
  mutates: boolean;
  args: { name: string; type: string }[];
}

export async function contract_info(api: any, address: string, abidata: any) {
  console.log(`contract info start`);
  // const contract_metadata = await getContractMetadata(api, address);
  const abiJson = abidata; //JSON.parse(fs.readFileSync('./src/flipper.json', 'utf8'));

  const contract = new ContractPromise(api, abiJson, address);
  const messageList: Message[] = [];
  const messages = contract.abi.messages; // abi.types to get the types
  messages.forEach((message) => {
    const msg: Message = {
      method: message.method,
      selector: message.selector.toString(),
      mutates: message.isMutating,
      args: message.args.map((arg) => ({
        name: arg.name,
        type: arg.type.displayName || arg.type.type,
      })),
    };

    messageList.push(msg);
  });

  // console.log(`contract info finished`);

  return messageList;
}
