import React from "react";
import HalmaBoard from "./components/HalmaBoard";

function App() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center w-full h-screen ">
        <HalmaBoard size={16} />
      </div>
    </div>
  );
}

export default App;
