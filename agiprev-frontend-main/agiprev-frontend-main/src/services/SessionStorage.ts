import React, { useEffect, useState } from 'react';

export function getSessionStorageValue<T>(
  key: string,
  defaultValue: T | undefined
) {
  // getting stored value
  if (typeof window !== 'undefined') {
    const saved = sessionStorage.getItem(key);
    const initial =
      saved && saved !== 'undefined' ? JSON.parse(saved) : defaultValue;
    return initial as T | undefined;
  }
  return undefined;
}

export const useSessionStorage = <T>(
  key: string,
  defaultValue: T | undefined
): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] => {
  const [value, setValue] = useState(() => {
    return getSessionStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export const removeSessionStorage = (key: string) => {
  sessionStorage.setItem(key, JSON.stringify(null));
};
