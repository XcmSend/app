// ModalContext.jsx
import React, { createContext, useState, useCallback, useContext } from 'react';
import ModalRoot from '../components/Bagpipes/Modal/ModalRoot';

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalNodeId, setModalNodeId] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 }); 
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [onNodesChange, setOnNodesChange] = useState(() => {});

  const openModal = useCallback((nodeId, content, config, nodes, edges, onNodesChange) => {
    console.log('Opening modal');
    setContent(content);
    setModalNodeId(nodeId);
    setIsOpen(true);
    setNodes(nodes);
    setEdges(edges);
    setOnNodesChange(() => onNodesChange);
    if (config && config.position) {
      setPosition(config.position);
    }
  }, []);
  

  const closeModal = useCallback(() => {
    setContent(null);
    setIsOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ content, isOpen, position, openModal, closeModal, modalNodeId, setModalNodeId, nodes, edges, onNodesChange }}>
      {children}
      {/* <ModalRoot /> */}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};

export default ModalProvider;
