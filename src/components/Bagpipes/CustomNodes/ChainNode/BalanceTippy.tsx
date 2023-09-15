// BalanceTippy.tsx
import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional if you've imported elsewhere
import 'tippy.js/themes/light.css'; // optional if you've imported elsewhere

import  StyledNumber from './StyledNumber'; // adjust the path accordingly if your component is located elsewhere

interface BalanceTippyProps {
    balance: {
        free: string;
        reserved: string;
        total: string;
    }
}

const BalanceTippy: React.FC<BalanceTippyProps> = ({ balance }) => {
    return (
        <Tippy 
            theme="light" 
            className="bg-white text-xxs tippy-chain m-0"
            content={
                <div className="bg-white text-xss tippy-chain flex flex-wrap p-1">
                    <div className="w-1/2 font-semibold">Available:</div> 
                    <div className="w-1/2 font-semibold">{balance.free}</div>
                    <div className="w-1/2 font-semibold">Reserved:</div> 
                    <div className="w-1/2">{balance.reserved}</div>
                    <div className="w-1/2 font-semibold">Total:</div> 
                    <div className="w-1/2">{balance.total}</div>
                </div>
            }
            arrow={false}
            placement="right"
        >
            <span className="cursor-pointer text-gray-600 unbounded">
                <StyledNumber value={balance.total} />
            </span>
        </Tippy>
    );
}

export default BalanceTippy;
