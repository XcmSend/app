// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { applyNodeChanges } from 'reactflow';
import { InputNodes } from './fields';
import { getAllConnectedNodes } from '../utils/getAllConnectedNodes';
import { getSavedFormState, setSavedFormState } from '../utils/storageUtils';
import useAppStore from '../../../store/useAppStore';
import { NodeFormProps } from './types';
import './Forms.scss';


const NodeForm: React.FC<NodeFormProps> = ({ nodeId, nodes, onNodesChange, setModalNodeId, edges, visible, children }) => {
  const node = nodes.find(n => n.id === nodeId) ?? null;
  const savedState = getSavedFormState(nodeId) ?? { inputNodes: node?.data?.inputNodes || [] };
  const { saveNodeFormData } = useAppStore((state) => ({ saveNodeFormData: state.saveNodeFormData }));
  const [position, setPosition] = useState('-250px'); // Initial position off-screen
  const [formState, setFormState] = useState(savedState);

  useEffect(() => {
      if (node) {
          setFormState(getSavedFormState(nodeId) ?? { inputNodes: node?.data?.inputNodes || [] });
      }
  }, [node]);

  useEffect(() => {
      setSavedFormState(nodeId, formState);
  }, [nodeId, formState]);

  const [inputNodes, setInputNodes] = useState(node?.data?.inputNodes || []);

  useEffect(() => {
      if (nodeId && edges) {
          const connectedNodeIds = getAllConnectedNodes(nodeId, edges);
          setInputNodes(connectedNodeIds);
      }
  }, [nodeId, edges]);

  const handleCancel = () => {
      setFormState({ inputNodes: [] });
      setModalNodeId(null);
  };

  const updateNode = () => {
      const updatedNode = { ...node, data: { ...node.data, ...formState } };
      onNodesChange(applyNodeChanges([updatedNode], nodes));
      saveNodeFormData(activeScenarioId, nodeId, formState);
      setModalNodeId(null);
  };

  

  const animationName = visible || isHiding ? 'slideIn' : 'slideOut';

  if (!visible) {
    console.log('NodeForm not visible');
    return null;
  }


  return (
    <div className='node-form bg-white p-4 rounded-md  text-xs' style={{ animationName: animationName }}>
          {children}
          {/* Generic fields and buttons */}
          <InputNodes inputNodes={inputNodes} />
          <div className='flex justify-end space-x-4'>
              <button className='px-4 py-2 text-sm text-white bg-red-500 rounded-md' onClick={handleCancel}>
                  Cancel
              </button>
              <button className='px-4 py-2 text-sm text-white bg-blue-500 rounded-md' onClick={updateNode}>
                  Save
              </button>
          </div>
      </div>
  );
};

export default NodeForm;
