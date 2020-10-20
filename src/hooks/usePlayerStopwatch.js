import { useRef, useState } from "react";

export const usePlayerStopwatch = () => {
  const [timer, setTimer] = useState(new Date().getTime());
  const [total, setTotal] = useState(0);

  const start = () => {
    const currentTime = new Date();
    setTimer(currentTime.getTime());
  };

  const pause = () => {
    const currentTime = new Date();
    setTotal(total + (currentTime.getTime() - timer));
  };

  return [total, start, pause];
};
