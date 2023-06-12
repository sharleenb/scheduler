import { useState } from "react";

function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    if (replace === true) {
      setMode(mode);
    } else {
      setMode(mode);
      history.push(mode);
      setHistory(history);
    }
  }

  function back() {
    if (history.length > 1) {
      history.pop();
      const prevMode = history[history.length - 1];
      setMode(prevMode);
    } else {
      setMode(initial);
    }
  }

  return { mode, transition, back };
}

export default useVisualMode;
