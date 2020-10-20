import React from "react";
import { useLocation } from "react-router";
import HalmaBoard from "./components/HalmaBoard";

function App() {
  const location = useLocation();
  const { playerBlue, playerOrange, bSize, tLimit } = location.state;

  console.log(location.state);

  return (
    <div className="container mx-auto flex flex-col justify-center items-center">
      <div
        className="flex flex-col justify-center items-center w-full h-screen"
        style={{ maxWidth: "800px" }}
      >
        <HalmaBoard
          size={bSize}
          timer={tLimit}
          playerBlue={playerBlue}
          playerOrange={playerOrange}
        />
      </div>
    </div>
  );
}

export default App;
