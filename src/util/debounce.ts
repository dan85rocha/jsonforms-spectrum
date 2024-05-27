import debounce from 'lodash/debounce';
import { useState, useEffect, useCallback } from 'react';

export const useDebouncedChange = (
  handleChange: (path: string, value: any) => void,
  defaultValue: any,
  data: any,
  path: string
): [any, (value: any) => void, () => void] => {
  let first = true;
  const timeout = 500;
  const [input, setInput] = useState(data ?? defaultValue);
  const debouncedUpdate = useCallback(
    debounce((newValue: any) => {
      if (!first) {
        handleChange(path, newValue);
      }
      first = false;
    }, timeout, {leading: false, trailing: true}),
    [handleChange, path, timeout]
  );

  useEffect(() => {
    setInput(data ?? defaultValue);
    debouncedUpdate(input);
  }, []);

  const onChange = useCallback(
    (value: any) => {
      setInput(value ?? defaultValue);
      debouncedUpdate(value);
    },
    [debouncedUpdate]
  );
  const onClear = useCallback(() => {
    setInput(defaultValue);
    handleChange(path, undefined);
  }, [defaultValue, handleChange, path]);
  return [input, onChange, onClear];
};
