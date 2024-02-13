//ts-nocheck
import { getApiInstance } from "./connect";

const getNonce = (chainEndpoint: string, address: string) => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      const api = await getApiInstance(chainEndpoint);
      const { nonce } = (await api.query.system.account(address)) as any;
      console.log("nonce in getNonce", nonce);
      resolve(nonce.toNumber());
      console.log("nonce", nonce.toNumber());
    } catch (error) {
      reject(error);
    }
  });
};

export default getNonce;
