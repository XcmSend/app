import { dot } from "@polkadot-api/descriptors";
import { createClient } from "polkadot-api";
import { getSmProvider } from "polkadot-api/sm-provider";
import { chainSpec } from "polkadot-api/chains/polkadot";
import { startFromWorker } from "polkadot-api/smoldot/from-worker";
// import SmWorker from "polkadot-api/smoldot/worker?worker";


interface SmoldotMethodParams {
  chainSpec: string;
}

class SmoldotService {
  private smoldotClient: any;
  private chain: any;

  constructor() {}

  async initializeSmoldotClient({ chainSpec }: SmoldotMethodParams) {
    try {
      const worker = new Worker(
        new URL("polkadot-api/smoldot/worker", import.meta.url)
      );      this.smoldotClient = startFromWorker(worker);
      this.chain = await this.smoldotClient.addChain({ chainSpec });
    } catch (error) {
      console.error('Error initializing Smoldot client:', error);
      throw error;
    }
  }

  async createApiClient() {
    if (!this.chain) {
      throw new Error('Smoldot client is not initialized.');
    }
    try {
      const client = createClient(getSmProvider(this.chain));
      return client;
    } catch (error) {
      console.error('Error creating API client:', error);
      throw error;
    }
  }

  async subscribeToFinalizedBlock(client: any, callback: (block: any) => void) {
    if (!client) {
      throw new Error('API client is not initialized.');
    }
    try {
      client.finalizedBlock$.subscribe(callback);
    } catch (error) {
      console.error('Error subscribing to finalized block:', error);
      throw error;
    }
  }

  async queryAccountValue(client: any, accountId: string) {
    if (!client) {
      throw new Error('API client is not initialized.');
    }
    try {
      const dotApi = client.getTypedApi(dot);
      const accountInfo = await dotApi.query.System.Account.getValue(accountId);
      return accountInfo;
    } catch (error) {
      console.error('Error querying account value:', error);
      throw error;
    }
  }
}

export default SmoldotService;
