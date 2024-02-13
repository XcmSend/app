import { useEffect, useState } from 'react';

export function useLocalStorage(key: string, initialValue = ''): [string, (v: string) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  const setValue = (value: string) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}
