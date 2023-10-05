// Copyright 2017-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0

// BalanceTippy.tsx
import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';

import  StyledNumber from './StyledNumber'; 

interface BalanceTippyProps {
    balance: {
        free: string;
        reserved: string;
        total: string;
    }
    symbol?: string;
}

const BalanceTippy: React.FC<BalanceTippyProps> = ({ balance, symbol }) => {
    return (
        <Tippy 
            theme="light" 
            className="bg-white text-xxs tippy-chain m-0"
            content={
                <div className="bg-white text-xss tippy-chain flex flex-wrap p-1">
                    <div className="w-1/2 font-semibold">Available:</div> 
                    <div className="w-1/2 font-semibold">{balance.free} {symbol}</div>
                    <div className="w-1/2 font-semibold">Reserved:</div> 
                    <div className="w-1/2">{balance.reserved } {symbol}</div>
                    <div className="w-1/2 font-semibold">Total:</div> 
                    <div className="w-1/2">{balance.total} {symbol}</div>
                </div>
            }
            arrow={false}
            placement="right"
        >
            <span className="cursor-pointer text-gray-600 unbounded">
                <StyledNumber value={balance.total} symbol={symbol} />
            </span>
        </Tippy>
    );
}

export default BalanceTippy;
