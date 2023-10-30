// @ts-nocheck
import React from 'react';
import Modal from './Modal.jsx';
import { useModal } from '../../../contexts/ModalContext.jsx';
import OpenAINodeForm from '../Forms/OpenAINodeForm/OpenAINodeForm.jsx';

const ModalRoot = () => {
  const { content, isOpen, position, closeModal, modalNodeId, setModalNodeId, nodes, edges, onNodesChange } = useModal();

  console.log('Rendering ModalRoot, isOpen:', isOpen);

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} position={position}>
      {modalNodeId && (
        <OpenAINodeForm
            nodeId={modalNodeId}
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            setModalNodeId={setModalNodeId}
        />
      )}
      {!modalNodeId && content}
    </Modal>
  );
};

export default ModalRoot;
