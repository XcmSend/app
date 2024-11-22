import { custompolkadot } from '@polkadot-api/descriptors';
import { chainSpec as polkadotchainSpec } from "polkadot-api/chains/polkadot";
import { createClient } from "polkadot-api";              
import { getSmProvider } from "polkadot-api/sm-provider"; 
import { startFromWorker } from "polkadot-api/smoldot/from-worker";
import SmWorker from 'polkadot-api/smoldot/worker?worker'



export async function get_polkadot_client(){
    console.log(`getting smoldot..`)
    //const worker =;
    //const smWorker = new Worker(import.meta.resolve("polkadot-api/smoldot/worker"));                                                               
    const smoldot = startFromWorker( new SmWorker());
    //const smoldot = startFromWorker(smWorker)                              
        console.log(`started smoldot client `)    
       // const pspec: any = polkadotchainSpec;                             
      //  const polkadotChain: Promise<any> = smoldot.addChain({ pspec }) ;
        console.log(`dot added`) 
        const dotRelayChain = import('polkadot-api/chains/polkadot').then(
            ({ chainSpec }) => smoldot.addChain({ chainSpec }),
          )                                             
        const provider = getSmProvider(dotRelayChain)                          
        const client = createClient(provider)                                  
        console.log(`got client`)                                              
                                                                               
        const api = client.getTypedApi(custompolkadot)                         
        console.log(``);
    return api;

}