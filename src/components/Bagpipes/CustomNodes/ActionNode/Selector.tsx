import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';
import { iIcon } from '../../../Icons/icons';

// Props type definition
type SelectorProps = {
    handleDropdownClick: (action: string) => void;
    SwapSVG: string;
    xTransferSVG: string;
    iIcon: string;  
}

const icons = {
    iIcon: './iIcon.svg'
}

const Selector: React.FC<SelectorProps> = ({ handleDropdownClick, SwapSVG, xTransferSVG }) => {
    return (
        <div className="relative absolute z-10 min-w-full border mt-1 rounded bg-white whitespace-nowrap">
            
            <div className="flex flex-col">
                <div onClick={() => handleDropdownClick('swap')} className="flex items-center p-2 hover:bg-gray-200 relative">
                    <img src={SwapSVG} alt="Swap" className="w-6 h-6 mr-2 border rounded p-1" />
                    <div className='text-xs bold font-semibold mr-2'>Swap</div>
                    <Tippy theme="light" content="Swap allows you to exchange one asset for another.">
                    <span className='absolute top-0 right-0 mt-1 mr-1 bg-blue-100 hover:bg-blue-200 p-1 rounded-full shadow-md cursor-pointer flex items-center justify-center'>
                        <img src={icons.iIcon} className='w-3 h-3' alt="Info"/>
                    </span>
                    </Tippy>
                </div> 
                <div onClick={() => handleDropdownClick('xTransfer')} className="flex items-center p-2 hover:bg-gray-200 relative">
                    <img src={xTransferSVG} alt="xTransfer" className="w-6 h-8 mr-2 border rounded p-1" />
                    <div className='text-xs font-semibold mr-2'>xTransfer</div>
                    <Tippy theme="light" content="xTransfer allows you to move assets between chains. If you want to move assets with a single use Transfer">
                    <span className='absolute top-0 right-0 mt-1 mr-1 bg-blue-100 hover:bg-blue-200 p-1 rounded-full shadow-md cursor-pointer flex items-center justify-center'>
                        <img src={icons.iIcon} className='w-3 h-3' alt="Info"/>
                    </span>

                    </Tippy>
                </div>
            </div>
        </div>
    )
}
    
export default Selector;

