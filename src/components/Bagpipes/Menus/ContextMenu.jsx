// @ts-nocheck
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const ContextMenu = ({ items, triggerEvent }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  

  useEffect(() => {
    if (!triggerEvent) return;
    const { pageX: x, pageY: y } = triggerEvent;
    setPosition({ x, y });
    console.log('Position, ', position);
    console.log('Event, ', triggerEvent);

    
    setVisible(true);
  }, [triggerEvent]);
  
  const handleGlobalClick = () => {
    setVisible(false);
  };

  useEffect(() => {
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const symbols = {

    settings: "./settings-outline.svg"
  }

  const menu = visible ? (
    <div
        className=" bg-white text-black p-2 rounded shadow-lg divide-y divide-gray-300 main-font"
        style={{ top: `${position.y}px`, left: `${position.x}px`, position: 'fixed', zIndex: 1000 }}
      >
      <div className="py-1 px-2 font-bold flex items-center">
        <img src ={symbols.settings} className="w-4 h-4" />
        <span className="ml-2">Settings</span>
      </div>
      {items.map((item, index) => (
        <div key={index} onClick={item.onClick} className="py-1 px-2 hover:bg-gray-200 flex items-center cursor-pointer">
          {/* put svg here */}
          <span className="ml-2">{item.label}</span>
        </div>
      ))}
    </div>
  ) : null;

  return ReactDOM.createPortal(menu, document.body);
};

export default ContextMenu;
