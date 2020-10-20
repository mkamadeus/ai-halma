import { useRef, useState } from "react";

export const usePlayerStopwatch = () => {
  const [isPaused, setIsPaused] = useState(true);
  const [timer, setTimer] = useState(0);
  const currentRef = useRef(null);

  const start = () => {
    // const currentTime = new Date();
    // setTimer(currentTime);
    // console.log("sss", timer);
    setIsPaused(false);
    currentRef.current = setInterval(() => {
      setTimer(timer + 1);
      console.log(timer);
    }, 1);
  };

  const pause = () => {
    clearInterval(currentRef.current);
    setIsPaused(true);
    // const currentTime = new Date();
    // setTotal(
    //   totalTime + (currentTime.getMilliseconds() - timer.getMilliseconds())
    // );
  };

  return [timer, start, pause];
};
