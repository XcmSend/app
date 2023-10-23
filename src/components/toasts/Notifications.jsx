import React from "react";
import toast  from "react-hot-toast";

 const Notifications = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;
  return (
    <div className="bg-white"
      style={{
        position: "fixed",
        top: 8,
        left: 8,
        zIndex: 100000
      }}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((toast) => {
        const offset = calculateOffset(toast, {
          reverseOrder: false,
          margin: 8
        });
        const ref = (el) => {
          if (el && typeof toast.height !== "number") {
            const height = el.getBoundingClientRect().height;
            updateHeight(toast.id, height);
          }
        };

        return (
          <div className="bg-red"
            key={toast.id}
            ref={ref}
            style={{
              position: "absolute",
              width: "200px",
              background: "papayawhip",
              transition: "all 0.5s ease-out",
              opacity: toast.visible ? 1 : 0,
              transform: `translateY(${offset}px)`,
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

export default Notifications;