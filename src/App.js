import React from "react";
import HalmaBoard from "./components/HalmaBoard";

function App() {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center">
      <div
        className="flex flex-col justify-center items-center w-full h-screen"
        style={{ maxWidth: "800px" }}
      >
        <HalmaBoard size={6} timer={10} />
      </div>
    </div>
  );
}

export default App;
