import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Setting = () => {
  const [playerBlue, setPlayerBlue] = useState("human");
  const [playerOrange, setPlayerOrange] = useState("human");
  const [bSize, setBSize] = useState(4);
  const [tLimit, setTLimit] = useState(10);
  const history = useHistory();

  const handleChange = (event) => {
    setPlayerBlue(event.target.playerBlue);
    setPlayerOrange(event.target.playerOrange);
    setBSize(event.target.bSize);
    setTLimit(event.target.tLimit);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    history.push("/play", { playerBlue, playerOrange, bSize, tLimit });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Blue player:
        <select
          value={playerBlue}
          onChange={(event) => {
            setPlayerBlue(event.target.value);
          }}
        >
          <option value="human">Human</option>
          <option value="minimax">AI - Minimax</option>
          <option value="minimaxlocal">AI - Minimax + Local Search</option>
        </select>
      </label>
      <label>
        Orange player:
        <select
          value={playerOrange}
          onChange={(event) => {
            setPlayerOrange(event.target.value);
          }}
        >
          <option value="human">Human</option>
          <option value="minimax">AI - Minimax</option>
          <option value="minimaxlocal">AI - Minimax + Local Search</option>
        </select>
      </label>
      <label>
        Board size:
        <select
          value={bSize}
          onChange={(event) => {
            setBSize(event.target.value);
          }}
        >
          <option value={6}>6</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={16}>16</option>
        </select>
      </label>
      <label>
        Time limit for each turn (in seconds):
        <input
          type="number"
          value={tLimit}
          onChange={(event) => {
            setTLimit(event.target.value);
          }}
        />
      </label>
      <input type="submit" value="Start" />
    </form>
  );
};

export default Setting;
