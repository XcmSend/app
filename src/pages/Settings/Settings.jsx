import React, { useState, useEffect, useRef, useContext } from 'react';
import ThemeToggleButton from '../../components/Theme/ThemeToggleButton';   
import ThemeContext from '../../contexts/ThemeContext';


function Settings() {
    const { theme } = useContext(ThemeContext);


    return (
        <div className={`${theme} lab-container p-8 h-full`}>
                       <ThemeToggleButton />

        </div>
    );
}

export default Settings;


