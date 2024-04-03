import React from 'react';

export function useDebounce(
  initialValue: string,
  delay: number = 1000
): [string, string, React.Dispatch<React.SetStateAction<string>>] {
  const [value, setValue] = React.useState(initialValue);
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return [value, debouncedValue, setValue];
}
