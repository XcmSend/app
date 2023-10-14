import React, { useEffect } from 'react';
import toast, { useToaster } from "react-hot-toast/headless";
import { useToasterStore } from 'react-hot-toast';
import ThemeContext from '../../contexts/ThemeContext';
// import '../../index.css'

function NodeNotifications () {
    // const { theme } = React.useContext(ThemeContext);
    const toastStore = useToasterStore();
    const { toasts, handlers } = useToaster();
    const { startPause, endPause, calculateOffset, updateHeight } = handlers;

    console.log("Toasts:", toasts); // Here's the log to see the toasts
    // Assuming the canvas is centered on the screen, 
    // these values represent half the width and height of the viewport.
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    return (
      <div
        onMouseEnter={startPause}
        onMouseLeave={endPause}
        // className={`${theme}`}
      >
        {toasts.map((toast) => {
          const defaultOffset = calculateOffset(toast, {
            reverseOrder: false,
            margin: 8
          });
          const ref = (el) => {
            if (el && typeof toast.height !== "number") {
              const height = el.getBoundingClientRect().height;
              updateHeight(toast.id, height);
            }
          };
          
          // If position is present in the toast data, adjust it relative to the center.
          // Otherwise, default to the top left.
          const position = toast.data?.position ? 
                          { x: centerX + toast.data.position.x, y: centerY + toast.data.position.y } : 
                          { x: 8, y: defaultOffset };

          const theme = toast.data?.theme;
          const combinedClass = `${toast.styleClass} ${theme}`;

          const bgColor = theme === 'light' ? 'var(--bg)' : 'var(--node-bg)';

          return (
            <div
              key={toast.id}
              ref={ref}
              className={toast.styleClass}              
              style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                background: "white",
                color: "black",
                width: "200px",
                transition: "all 0.5s ease-out",
                opacity: toast.visible ? 1 : 0,
                zIndex: 100000
              }}
            >
              {toast.message}
            </div>
          );
        })}
      </div>
    );
};

export default NodeNotifications;
