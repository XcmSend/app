// @ts-nocheck
// Modal.jsx
import React from 'react';

const Modal = ({ isOpen, position, dimensions, children, onRequestClose }) => {
  if (!isOpen) {
    return null;
  }

  const style = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 1000, // to ensure modal sits on top of other contents
  }

  return (
    <div style={style} className="modal-style border border-gray-300 shadow-md p-4">
      <div>
        <button className="close-modal bg-red" onClick={onRequestClose}>x</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
