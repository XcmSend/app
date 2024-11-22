import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const URLModal = ({ url }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const handleOk = () => {
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Show Generated URL
      </Button>
      <Modal title="Generated URL" visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>{url}</p>
        <p>Copy and share this URL to access the saved Blink data.</p>
      </Modal>
    </>
  );
};

export default URLModal;
