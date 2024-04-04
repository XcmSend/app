import React, { useCallback, useContext, useEffect } from 'react';
import { Switch } from 'antd';
import ThemeContext from '../../contexts/ThemeContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

import '../../styles/ThemeSwitch.scss';

function ThemeSwitch() {
  const [theme, setTheme] = useLocalStorage('bagpipes-theme', 'light');

  useEffect(() => {
    const isDarkMode = theme === 'dark';
    document.body.style.backgroundColor = isDarkMode ? '#020412' : '#FFF';
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [theme]);

  const handleThemeChange = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className='main-layout'>
        <div className={`main-content ${theme === 'dark' ? '-dark' : '-light'}`}>
          <Switch
            checkedChildren='Light'
            className='bagpipes-switch-theme'
            defaultChecked={theme === 'dark'}
            onChange={handleThemeChange}
            unCheckedChildren='Dark'
          />
          {/* Your main content here */}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default ThemeSwitch;
