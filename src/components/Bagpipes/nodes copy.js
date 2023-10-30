// @ts-nocheck
const nodes = [
    {
      id: 'A',
      type: 'group',
      position: { x: 0, y: 0 },
      style: {
        width: 170,
        height: 140,
      },
    },
    {
      id: 'A-1',
      type: 'input',
      data: { label: 'Child Node 1' },
      position: { x: 10, y: 10 },
      parentNode: 'A',
      extent: 'parent',
    },
    {
      id: 'A-2',
      data: { label: 'Child Node 2' },
      position: { x: 10, y: 90 },
      parentNode: 'A',
      extent: 'parent',
    },
    {
      id: 'B',
      type: 'output',
      position: { x: -100, y: 200 },
      data: { label: 'Open AI' },
      style: {
        width: 170,
        height: 140,
        backgroundColor: 'rgba(240,240,240,0.25)',
      },
    },
    {
      id: 'B-1',
      data: { label: 'Child 1' },
      position: { x: 0, y: 10 },
      type: 'textUpdater',
      parentNode: 'B',
      extent: 'parent',
      draggable: false,
      style: {
        width: 60,
      },
    },
    {
      id: 'B-2',
      data: { label: 'Child 2' },
      position: { x: 10, y: 90 },
      parentNode: 'B',
      extent: 'parent',
      draggable: false,
      style: {
        width: 60,
      },
    },
    {
      id: 'B-3',
      data: { label: 'Child 3' },
      position: { x: 100, y: 90 },
      parentNode: 'B',
      extent: 'parent',
      draggable: false,
      style: {
        width: 60,
      },
    },
    {
      id: 'C',
      type: 'output',
      position: { x: 100, y: 200 },
      data: { label: 'Node C' },
    },
    { id: 'node-1', type: 'textUpdater', position: { x: 0, y: 0 }, data: { value: 123 } },
    { id: '1', position: { x: 0, y: 50 }, data: { 
        label: 'Gary (gpt4)' 
      } 
    },
    { id: '2', position: { x: 0, y: 100 }, data: { label: 'OpenAI' } }

  ];
  
  export default nodes;


  