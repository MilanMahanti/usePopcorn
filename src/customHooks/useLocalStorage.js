import { useEffect, useState } from "react";

export function useLocalStorage(LOCAL_STORAGE_KEY) {
  const [value, setValue] = useState(() => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  });
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
  }, [value, LOCAL_STORAGE_KEY]);

  return [value, setValue];
}
