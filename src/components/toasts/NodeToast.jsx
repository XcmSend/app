import React from 'react';
import toast  from "react-hot-toast";

const NodeToast = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div onMouseEnter={startPause} onMouseLeave={endPause}>
      {toasts.map((toast) => {
        // Use the toast id or other metadata to determine the positioning
        let position = {};
        if (toast.id === 'execution-action') {
          position = {
            top: toast?.data?.position?.y || '8px', // Provide fallback or default values
            left: toast?.data?.position?.x || '8px'
          };
        }

        return (
          <div
            key={toast.id}
            // style={{
            //   position: 'absolute',
            //   ...position,
            //   width: '200px',
            //   background: '#363636',
            //   color: '#fff',
            //   transition: 'all 0.5s ease-out',
            //   opacity: toast.visible ? 1 : 0,
            // }}
            style={{
              position: 'absolute',
              top: '100px',
              left: '100px',
              width: '200px',
              background: '#363636',
              color: '#fff',
              transition: 'all 0.5s ease-out',
            }}            
            {...toast.ariaProps}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
  };
  
  export default NodeToast;