import React, { useState } from "react";
import HalmaBoard from "./components/HalmaBoard";
import SettingsDialog from "./components/SettingsDialog";
import { Button } from "@/components/ui/button";
import type { PlayerConfig } from "./types";

interface ActiveGameConfig {
  boardSize: number;
  timeLimit: number;
  playerBlue: PlayerConfig;
  playerOrange: PlayerConfig;
}

function App(): React.JSX.Element {
  const [gameConfig, setGameConfig] = useState<ActiveGameConfig | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = (config: ActiveGameConfig): void => {
    setGameConfig(config);
    setGameKey((k) => k + 1);
  };

  const handleNewGame = (): void => {
    setGameConfig(null);
  };

  return (
    <div className="h-dvh overflow-y-auto flex flex-col items-center px-3 sm:px-4 py-3 sm:py-6">
      <SettingsDialog open={gameConfig === null} onStart={handleStart} />

      {gameConfig && (
        <div
          className="w-full h-full min-h-0 flex flex-col gap-2 sm:gap-4"
          style={{ maxWidth: "800px" }}
        >
          <div className="flex items-center justify-between shrink-0">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
              Halma
            </h1>
            <Button variant="outline" size="sm" onClick={handleNewGame}>
              New Game
            </Button>
          </div>

          <HalmaBoard
            key={gameKey}
            size={gameConfig.boardSize}
            timer={gameConfig.timeLimit}
            playerBlue={gameConfig.playerBlue}
            playerOrange={gameConfig.playerOrange}
            onNewGame={handleNewGame}
          />
        </div>
      )}
    </div>
  );
}

export default App;
