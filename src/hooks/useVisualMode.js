import { useState } from "react";

function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    if (replace === true) {
      setMode(mode);
    } else {
      setMode(mode);
      setHistory(prev => [...prev, mode])

    }
  }

  function back() {
    if (history.length > 1) {
      setHistory((prev) => [...prev.slice(0, -1)])
      const prevMode = history[history.length - 2];
      setMode(prevMode);
    } else {
      setMode(initial);
    }
  }

  return { mode, transition, back };
}

export default useVisualMode;
