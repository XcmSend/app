import React, { useEffect } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";

function ThemeProvider({ children }) {
    const [theme, setTheme] = useLocalStorage('bagpipes-theme', 'light');

    useEffect(() => {
        const isDarkMode = theme === 'dark';
        document.body.style.backgroundColor = isDarkMode ? '#020412' : '#FFF';
        document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;



