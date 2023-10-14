import React from 'react';
import toast, { useToaster } from "react-hot-toast/headless";

function NodeNotifications() {
    const { toasts, handlers } = useToaster();
    const { startPause, endPause, updateHeight } = handlers;

    return (
        <div
            onMouseEnter={startPause}
            onMouseLeave={endPause}
            style={{
                position: "absolute",
                zIndex: 10000
            }}
        >
            {toasts.map((toast) => {
                const ref = (el) => {
                    if (el && typeof toast.height !== "number") {
                        const height = el.getBoundingClientRect().height;
                        updateHeight(toast.id, height);
                    }
                };

                // Extract the position from toast.data
                const position = toast.data?.position || { x: 8, y: 8 }; // default values

                return (
                    <div
                        key={toast.id}
                        ref={ref}
                        style={{
                            position: "absolute",
                            left: `${position.x}px`,
                            top: `${position.y}px`,
                            width: "200px",
                            background: "white",
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
}

export default NodeNotifications;
