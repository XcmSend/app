// @ts-nocheck
import React, { useState } from 'react';

export default function NodeMenu({ nodeId }) {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="node-menu relative">
            <button onClick={toggleMenu} className="bg-gray-200 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
            {isOpen && (
                <ul className="node-menu-dropdown absolute right-0 w-32 mt-2 py-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm text-gray-700">
                    <li className="px-3 py-1 hover:bg-gray-100">Option 1</li>
                    <li className="px-3 py-1 hover:bg-gray-100">Option 2</li>
                    <li className="px-3 py-1 hover:bg-gray-100">Option 3</li>
                </ul>
            )}
        </div>
    );
}
