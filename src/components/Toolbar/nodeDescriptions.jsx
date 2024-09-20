import { ActionIcon, ChainIcon, ToolsIcon, RouterIcon, WebhookIcon, WebsocketIcon, ScheduleIcon, DelayIcon, APIIcon, CodeIcon, DiscordIcon, OpenAIIcon, HttpIcon } from '../Icons/icons'; 


export const nodeDescriptions = {
    chain: 
      <div className='m-4 tippy-node'>
          <div className='flex justify-between'>  
            <h1 className='text-xl font-bold'>Chain </h1>
            <ChainIcon className='h-6 w-6 ml-3'fillColor='black' />
          </div>
          <p>Drag and drop a chain node on to the canvas to select the chain you want to use.</p>
          <img src='./screenshots/ChainNodeScreenshot.png'></img>
  
      </div>,
    action: 
      <div className='m-4 tippy-node'>
             <div className='flex justify-between'>
            <ActionIcon className='h-6 w-6 ml-3'fillColor='black' />
          <h1 className='text-xl font-bold'>Action </h1>
          </div>
          <p>Drag and drop an action to make an action (transfer, xTransfer, Swap, etc.).</p>
          <img className='action-image'src='./screenshots/ActionNodeScreenshot.png'></img>
      </div>,
       chainTx: 
       <div className='m-4 tippy-node'>
           <div className='flex justify-between'>  
             <h1 className='text-xl font-bold'>Chain TX </h1>     
             <ChainIcon className='h-6 w-6 ml-3'fillColor='black' />
           </div>
           <h3 className='font-semibold'> (Advanced users)</h3>
           <p>Drag and drop a chain Tx node on to the canvas to select the chain you want to use.</p>
           <p>View the docs for more info about the <a href='https://docs.bagpipes.io/docs/nodes/chainTx'>Chain Tx</a> node.</p>

           <img src='./screenshots/ChainTxNodeScreenshot.png'></img>
   
       </div>,
        http: 
        <div className='m-4 tippy-node'>
          <div className='flex justify-between'>
            <h1 className='text-xl font-bold '>HTTP Request </h1>
            <HttpIcon className='h-6 w-6 ml-3'fillColor='black' />

            </div>
            <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
            <img src='./screenshots/HttpNodeScreenshot.png'></img>

        </div>,
      webhook: 
      <div className='m-4 tippy-node'>
         <div className='flex justify-between'>
        <h1 className='text-xl font-bold '>Webhook </h1>
        <WebhookIcon className='h-6 w-6 ml-3'fillColor='black' />

        </div>
        <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
        <img src='./screenshots/WebhookNodeScreenshot.png'></img>

      </div>,
     tools: 
      <div className='m-4 tippy-node'>
           <div className='flex justify-between'>
            <h1 className='text-xl font-bold '>Tools (coming soon) </h1>
            
            <ToolsIcon className='h-6 w-6 ml-3'fillColor='black' />

        </div>
        <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
      </div>,
 
      websocket: 
      <div className='m-4 tippy-node'>
        <h1 className='text-xl font-bold '>Websocket (coming soon) </h1>
        <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
    </div>,
    router: 
      <div className='m-4 tippy-node'>
        <h1 className='text-xl font-bold '>Router (coming soon) </h1>
        <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
    </div>,
    schedule: 
    <div className='m-4 tippy-node'>
      <h1 className='text-xl font-bold '>Schedule (coming soon) </h1>
      <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
  </div>,
  delay: 
  <div className='m-4 tippy-node'>
    <h1 className='text-xl font-bold '>Delay (coming soon) </h1>
    <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
  </div>,

blinks: 
<div className='m-4 tippy-node'>
  <div className='flex justify-between'>
  <h1 className='text-xl font-bold '>Blinks Builder</h1>
  <CodeIcon className='h-6 w-6 ml-3'fillColor='black' />

  </div>
  <p>Create a blockchain link "Blink" to share with others. If you paste it into a twitter post, it becomes a Dapp. Learn more in the docs. </p>

</div>,

  code: 
  <div className='m-4 tippy-node'>
    <div className='flex justify-between'>
    <h1 className='text-xl font-bold '>Custom Code (coming soon) </h1>
    <CodeIcon className='h-6 w-6 ml-3'fillColor='black' />
  
    </div>
    <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
  
  </div>,
  discord: 
  <div className='m-4 tippy-node'>
    <h1 className='text-xl font-bold '>Discord (coming soon) </h1>
    <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
  </div>,
  openAi: 
  <div className='m-4 tippy-node'>
    <h1 className='text-xl font-bold '>Chat GPT (coming soon) </h1>
    <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
  </div>,
  chatGpt: 
  <div className='m-4 tippy-node'>
    <h1 className='text-xl font-bold '>Open AI (coming soon) </h1>
    <p>A list of tools to add more functionality to your workflow, such as event handlers, if/else statements, promises, for loops, hash functions, routers, triggers, etc.</p>
  </div>,
    lightClient: 
    <div className='m-4 tippy-node'>
      <h1 className='text-xl font-bold '>Light Client (coming soon) </h1>
      <p>A blockchain light client that runs on your service or in an extension. </p>
    </div>
  }
  