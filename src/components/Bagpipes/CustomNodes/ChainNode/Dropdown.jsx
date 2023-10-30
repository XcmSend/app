import React, { useState, useRef, useEffect } from 'react';
import '../../../../index.css';
import '../../node.styles.scss';

export default function Dropdown({ options, renderOption, onOptionSelected, placeholder = 'Select' }) {
  const [isOpen, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onOptionSelected(option);
    setOpen(false);
  };

  return (
    <div className='relative dropdown' ref={dropdownRef}>
      <button 
        onClick={() => setOpen(prevOpen => !prevOpen)}
        className="bg-gray-200 text-gray-700 py-2 px-4 rounded shadow hover:bg-gray-300 focus:outline-none focus:ring"
      >
        {selectedOption ? renderOption(selectedOption) : placeholder}
      </button>

      {isOpen && (
        <div 
          className='absolute left-0 mt-2 w-full py-1 bg-black border border-gray-200 rounded shadow-lg transition ease-out duration-150'
        >
          {options.map(option => (
            <div 
              key={option.value} 
              className='cursor-pointer px-4 py-2 hover:bg-gray-100' 
              onClick={() => handleOptionClick(option)}
            >
              {renderOption(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
