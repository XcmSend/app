import React, { useRef, useEffect } from 'react';
import ThemeContext from '../../../../contexts/ThemeContext';
import '../../node.styles.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';
import { iIcon } from '../../../Icons/icons'

// Props type definition
type SelectorProps = {
    handleDropdownClick: (action: string) => void;
    setDropdownVisible: (visible: boolean) => void; 
    SwapSVG: string;
    xTransferSVG: string;
    iIcon: string;  
    dropdownVisible: boolean;

}

const icons = {
    iIcon: './iIcon.svg'
}


export function useOutsideAlerter(ref: React.RefObject<HTMLElement>, callback: () => void) {
    useEffect(() => {
      // Function to call on click event
      function handleClickOutside(event: MouseEvent) {
        console.log('useOutsideAlerter Document was clicked');
  
        if (ref.current && !ref.current.contains(event.target as Node)) {
          console.log('useOutsideAlerterClick was outside ref.current, calling callback');
          callback();
        } else {
          console.log('useOutsideAlerter Click was inside ref.current, not calling callback');
        }
      }
  
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      console.log('useOutsideAlerter Event listener added');
  
      // Cleanup function to remove the event listener
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        console.log('useOutsideAlerter Event listener removed');
      };
    }, [ref, callback]);
  
    // Log the current status of ref
    console.log('useOutsideAlerter Current ref:', ref.current);
  }
  

const Selector = React.forwardRef<HTMLDivElement, SelectorProps>(({ handleDropdownClick, SwapSVG, xTransferSVG }, ref) => {
      const { theme } = React.useContext(ThemeContext);


    return (
        <div ref={ref} className={`${theme} background relative z-10`} style={{ width: 'auto', top: '100%' }}>
            
            <div className="flex flex-col">
                <div onClick={() => handleDropdownClick('swap')} className="hovering flex items-center p-2  relative">
                    <div className='bg-white flex justify-center align-center p-1 mr-2 border rounded'>
                    <img src={SwapSVG} alt="Swap" className="w-3 h-3 border rounded" />
                    </div>
                    <div className='text-xs bold font-semibold align-right'>Swap </div>
                    <Tippy theme="light" content="Swap allows you to exchange one asset for another.">
                    <span className='absolute top-0 right-0 mt-1 mr-1 bg-blue-100 hover:bg-blue-200 p-1 rounded-full shadow-md cursor-pointer flex items-center justify-center w-3 h-3'>
                        <img src={icons.iIcon} className='w-1 h-1' alt="Info"/>
                    </span>
                    </Tippy>
                </div> 
                <div onClick={() => handleDropdownClick('xTransfer')} className="hovering flex items-center p-2 hover:bg-gray-200 relative">
                    <div className='bg-white flex justify-center align-center p-1 mr-2 border rounded h-6'>

                    <img src={xTransferSVG} alt="xTransfer" className="w-3 h-4border rounded" />
                    </div>
                    <div className='text-xs font-semibold mr-2'>xTransfer</div>
                    <Tippy theme="light" content="xTransfer means 'cross-chain transfer', it allows you to move assets between chains. If you want to move assets within a single chain, just use Transfer.">
                    <span className='absolute top-0 right-0 mt-1 mr-1 bg-blue-100 hover:bg-blue-200 p-1 rounded-full shadow-md cursor-pointer flex items-center justify-center w-3 h-3'>
                        <img src={icons.iIcon} className='w-1 h-1' alt="Info"/>
                    </span>

                    </Tippy>
                </div>
            </div>
        </div>
    )})
    
export default Selector;
