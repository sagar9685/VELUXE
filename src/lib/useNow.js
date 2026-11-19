import { useEffect, useState } from 'react';

/** Returns the current timestamp, refreshed every second (for countdowns). */
export default function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
