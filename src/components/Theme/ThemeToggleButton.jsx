import React, { useContext, useCallback } from "react";
import { Switch } from 'antd';
import ThemeContext from "../../contexts/ThemeContext";
import './Theme.scss';

function ThemeToggleButton() {
    const { theme, setTheme } = useContext(ThemeContext);

    const handleThemeChange = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme); // This will update local storage as well
    }, [theme, setTheme]);

    return (
        <Switch
            checkedChildren='Light'
            className='bagpipes-switch-theme'
            defaultChecked={theme === 'dark'}
            onChange={handleThemeChange}
            unCheckedChildren='Dark'
        />
    );
}

export default ThemeToggleButton;
