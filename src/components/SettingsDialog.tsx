import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PlayerConfig, DifficultyLevel } from "../types";
import { DIFFICULTY_LABELS } from "../types";

interface SettingsDialogProps {
  open: boolean;
  onStart: (config: {
    playerBlue: PlayerConfig;
    playerOrange: PlayerConfig;
    boardSize: number;
    timeLimit: number;
  }) => void;
}

type PlayerMode = "human" | "ai";

const difficultyKeys = Object.keys(DIFFICULTY_LABELS) as DifficultyLevel[];

const PlayerSelect: React.FC<{
  id: string;
  label: string;
  mode: PlayerMode;
  difficulty: DifficultyLevel;
  onModeChange: (mode: PlayerMode) => void;
  onDifficultyChange: (d: DifficultyLevel) => void;
}> = ({ id, label, mode, difficulty, onModeChange, onDifficultyChange }) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Select value={mode} onValueChange={(v) => onModeChange(v as PlayerMode)}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="human">Human</SelectItem>
        <SelectItem value="ai">AI</SelectItem>
      </SelectContent>
    </Select>
    {mode === "ai" && (
      <Select
        value={difficulty}
        onValueChange={(v) => onDifficultyChange(v as DifficultyLevel)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {difficultyKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {DIFFICULTY_LABELS[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  </div>
);

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onStart }) => {
  const [blueMode, setBlueMode] = useState<PlayerMode>("human");
  const [blueDifficulty, setBlueDifficulty] =
    useState<DifficultyLevel>("medium");
  const [orangeMode, setOrangeMode] = useState<PlayerMode>("human");
  const [orangeDifficulty, setOrangeDifficulty] =
    useState<DifficultyLevel>("medium");
  const [boardSize, setBoardSize] = useState("8");
  const [timeLimit, setTimeLimit] = useState(10);

  const toPlayerConfig = (
    mode: PlayerMode,
    difficulty: DifficultyLevel,
  ): PlayerConfig =>
    mode === "human" ? { type: "human" } : { type: "ai", difficulty };

  const handleSubmit = (): void => {
    onStart({
      playerBlue: toPlayerConfig(blueMode, blueDifficulty),
      playerOrange: toPlayerConfig(orangeMode, orangeDifficulty),
      boardSize: Number(boardSize),
      timeLimit,
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
          <DialogDescription>
            Configure players, board size, and time limit before starting.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <PlayerSelect
            id="playerBlue"
            label="Blue Player"
            mode={blueMode}
            difficulty={blueDifficulty}
            onModeChange={setBlueMode}
            onDifficultyChange={setBlueDifficulty}
          />

          <PlayerSelect
            id="playerOrange"
            label="Orange Player"
            mode={orangeMode}
            difficulty={orangeDifficulty}
            onModeChange={setOrangeMode}
            onDifficultyChange={setOrangeDifficulty}
          />

          <div className="grid gap-2">
            <Label htmlFor="boardSize">Board Size</Label>
            <Select value={boardSize} onValueChange={setBoardSize}>
              <SelectTrigger id="boardSize" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 × 6</SelectItem>
                <SelectItem value="8">8 × 8</SelectItem>
                <SelectItem value="10">10 × 10</SelectItem>
                <SelectItem value="16">16 × 16</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timeLimit">Time Limit (seconds per turn)</Label>
            <Input
              id="timeLimit"
              type="number"
              min={5}
              max={300}
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value) || 5)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Start Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
