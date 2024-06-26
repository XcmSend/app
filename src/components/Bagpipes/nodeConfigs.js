export const getNodeConfig = (type, position, getId) => {
  const commonStyle = { backgroundColor: 'rgba(255, 0, 0, 0)', width: 100, height: 100 };
  
    const nodeConfigs = {
      formGroup: {
        label: 'Form Group', image: './formGroup.svg', name: 'Form Group Example',
        fields: [{ label: "Field 1", type: "text" }, { label: "Field 2", type: "number" }],
        style: commonStyle,
      },
      openAi: {
        label: 'Open AI',
        image: './openai.svg',
        name: "OpenAI",
        style: commonStyle,  
      },
      chatGpt: {
        label: 'Chat GPT',
        image: './openai.svg',
        name: "ChatGPT",
        style: commonStyle,  
      },
      chain: {
        label: 'Chain',
        image: './chain.svg',
        name: "Chain",
        
      },
      chainQuery: {
        label: 'Query Chain',
        image: './chainQuery.svg',
        name: "Query Chain",
      },
      chainTx: {
        label: 'Chain TX',
        image: './chainQuery.svg',
        name: "Chain TX",
      },
      discord: {
        label: 'Discord',
        image: './discord-purple.svg',
        name: "Discord",
        
      },
       webhook: {
        label: 'Webhook',
        image: './webhook.svg',
        name: "Webhook",
      },
      websocket: {
        label: 'Websocket',
        image: './websocket.svg',
        name: "Websocket",
      },
      router: {
        label: 'Router',
        image: './router.svg',
        name: "Router",
        
      },
      api: {
        label: 'API',
        image: './api.svg',
        name: "API",
        
      },
      code: {
        label: 'Custom Code',
        image: './code.svg',
        name: "Custom Code",
      },
      schedule: {
        label: 'Schedule',
        image: './schedule.svg',
        name: "Schedule",
      },
      schedule: {
        label: 'Action',
        image: './action.svg',
        name: "Action",
      },
    };
  
    return {
      id: getId(type),
      type,
      position,
      data: nodeConfigs[type] || { label: type },
      style: nodeConfigs[type]?.style || {},
    };
  };

