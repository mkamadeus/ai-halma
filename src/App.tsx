import React, { useState } from "react";
import HalmaBoard from "./components/HalmaBoard";
import SettingsDialog from "./components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto flex flex-col items-center px-4 py-8">
      <SettingsDialog open={gameConfig === null} onStart={handleStart} />

      {gameConfig && (
        <div
          className="w-full flex flex-col items-center"
          style={{ maxWidth: "800px" }}
        >
          <div className="w-full flex justify-end mb-4">
            <Button variant="outline" onClick={handleNewGame}>
              New Game
            </Button>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-xl">Halma</CardTitle>
            </CardHeader>
            <CardContent>
              <HalmaBoard
                key={gameKey}
                size={gameConfig.boardSize}
                timer={gameConfig.timeLimit}
                playerBlue={gameConfig.playerBlue}
                playerOrange={gameConfig.playerOrange}
                onNewGame={handleNewGame}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;
