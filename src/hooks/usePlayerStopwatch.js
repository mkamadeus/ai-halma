const { useStopwatch } = require("react-timer-hook");

export const usePlayerStopwatch = () => {
  const { seconds, start, pause } = useStopwatch();

  return [seconds, start, pause];
};
