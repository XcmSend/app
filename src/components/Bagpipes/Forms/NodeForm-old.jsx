// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { applyNodeChanges } from 'reactflow';
import { Model, Prompt, SystemMessage, InputNodes } from './fields';
import { getAllConnectedNodes } from '../utils/getAllConnectedNodes';
import { getSavedFormState, setSavedFormState } from '../utils/storageUtils';
import useAppStore from '../../../store/useAppStore';

const NodeForm = ({ nodeId, nodes, onNodesChange, setModalNodeId, edges }) => {
    // Node that is currently being edited
    const node = Array.isArray(nodes) ? nodes.find(n => n.id === nodeId) : null;
    const savedState = getSavedFormState(nodeId);
    const initialState = savedState || {
        model: node?.data?.model || '',
        systemMessage: node?.data?.systemMessage || '',
        prompt: node?.data?.prompt || '',
        inputNodes: node?.data?.inputNodes || [],
    };
    const { activeScenarioId, saveNodeFormData } = useAppStore((state) => ({
      activeScenarioId: state.activeScenarioId,
      saveNodeFormData: state.saveNodeFormData,
    }));
    

   
    // Initial state of the form
    const [formState, setFormState] = useState(savedState || initialState);

    // Model input handler
    const handleModelChange = (event) => {
        setFormState(prevState => ({ ...prevState, model: event.target.value }));
    };



      /**
   * Update form state when the node changes.
   */
      useEffect(() => {
        if (node) {
            const savedState = getSavedFormState(nodeId);
            console.log('savedState:', savedState);  // Add console log here
    
            const initialState = savedState || {
            model: node?.data?.model || '',
            systemMessage: node?.data?.systemMessage || '',
            prompt: node?.data?.prompt || '',
            inputNodes: node?.data?.inputNodes || [],
            };
    
            console.log('initialState:', initialState);  // Add console log here
            setFormState(initialState);
        }
    }, [node]);
    
      
  // Save state to local storage when formState changes
  useEffect(() => {
    setSavedFormState(nodeId, formState);
  }, [nodeId, formState]);

    // Reference to the RichTextEditor
    const richTextEditorRef = useRef();

     // Input nodes and their connections
     const [inputNodes, setInputNodes] = useState([]);


    useEffect(() => {
        if (nodeId && edges) {
          const connectedNodeIds = getAllConnectedNodes(nodeId, edges);
          const disconnectedNodeIds = inputNodes.filter(id => !connectedNodeIds.includes(id));
      
          disconnectedNodeIds.forEach(disconnectedNodeId => {
            const nodeIndex = formState.prompt.indexOf(`{${disconnectedNodeId}}`);
            const quill = richTextEditorRef.current.quillRef.current;
            quill.formatText(nodeIndex, disconnectedNodeId.length + 2, 'class', 'removed-node');
          });
      
          setInputNodes(connectedNodeIds);
        }
      }, [nodeId, edges, formState.prompt]); 


  /**
   * Clear the form and close the modal.
   */
  const handleCancel = () => {
    setFormState({
      model: '',
      systemMessage: '',
      prompt: '',
      inputNodes: []
    });
    setModalNodeId(null);
  };


/**
   * Update the node with the form data and close the modal.
   */
const updateNode = () => {
    const updatedNode = { ...node, data: { ...node.data, ...formState } };
    onNodesChange(applyNodeChanges([updatedNode], nodes));
    saveNodeFormData(activeScenarioId, nodeId, formState);  // Save form data to the store
    setModalNodeId(null);
  };

  useEffect(() => {
  
      setFormState(initialState);
    
  }, [nodeId]);
  
  useEffect(() => {
    console.log('NODE ID has changed to:', nodeId);
  }, [nodeId]);

  return (
    <div className='node-form bg-white p-6 rounded-md shadow-lg space-y-4 text-xs'>
      <h2 className='text-xl font-semibold text-gray-800'>Open AI </h2>
      <div className="">{nodeId}</div>
      <Model value={formState.model} onChange={handleModelChange} />
      <SystemMessage value={formState.systemMessage} onChange={(value) => setFormState(prevState => ({ ...prevState, systemMessage: value }))} />
      <Prompt
        nodeId={nodeId}
        edges={edges}
        inputNodes={inputNodes}
        setInputNodes={setInputNodes}
        formState={formState}
        setFormState={setFormState}
        richTextEditorRef={richTextEditorRef}
      />
    <InputNodes inputNodes={inputNodes} />

      <div className='flex justify-end space-x-4'>
        <button 
          className='px-4 py-2 text-sm text-white bg-red-500 rounded-md'
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          className='px-4 py-2 text-sm text-white bg-blue-500 rounded-md'
          onClick={updateNode}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NodeForm;
