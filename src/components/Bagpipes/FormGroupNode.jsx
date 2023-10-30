// @ts-nocheck
import React from 'react';
import { useModal } from '../../contexts/ModalContext'

export default function FormGroupNode({ data }) {
  const { openModal } = useModal();
  const fields = data.fields || [];

  const handleNodeClick = () => {
    console.log('Node clicked');
  
    openModal(
      <div>
        <h3>{data.label}</h3>
        {fields.map((field, index) => (
          <div key={index}>
            <label>{field.label}</label>
            <input type={field.type} />
          </div>
        ))}
      </div>,
      { position: { x: 100, y: 100 } }  // example position
    );
  };

  const nodeStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    borderRadius: "50%",
    backgroundColor: "transparent",
    border: "none",
  };

  const imgStyle = {
    width: "100px",
    height: "100px",
  };

  return (
    <div onClick={handleNodeClick} style={nodeStyle}>
      <img src={data.image} alt="Form Group" style={imgStyle} />
    </div>
  );
}

