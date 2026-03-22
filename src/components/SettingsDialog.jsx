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

const SettingsDialog = ({ open, onStart }) => {
  const [playerBlue, setPlayerBlue] = useState("human");
  const [playerOrange, setPlayerOrange] = useState("human");
  const [boardSize, setBoardSize] = useState("8");
  const [timeLimit, setTimeLimit] = useState(10);

  const handleSubmit = () => {
    onStart({
      playerBlue,
      playerOrange,
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
          <div className="grid gap-2">
            <Label htmlFor="playerBlue">Blue Player</Label>
            <Select value={playerBlue} onValueChange={setPlayerBlue}>
              <SelectTrigger id="playerBlue" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human">Human</SelectItem>
                <SelectItem value="minimax">AI - Minimax</SelectItem>
                <SelectItem value="minimaxlocal">
                  AI - Minimax + Local Search
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="playerOrange">Orange Player</Label>
            <Select value={playerOrange} onValueChange={setPlayerOrange}>
              <SelectTrigger id="playerOrange" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human">Human</SelectItem>
                <SelectItem value="minimax">AI - Minimax</SelectItem>
                <SelectItem value="minimaxlocal">
                  AI - Minimax + Local Search
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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
