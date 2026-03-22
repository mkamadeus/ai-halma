import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Setting = () => {
  const [playerBlue, setPlayerBlue] = useState("human");
  const [playerOrange, setPlayerOrange] = useState("human");
  const [bSize, setBSize] = useState(6);
  const [tLimit, setTLimit] = useState(10);
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    history.push("/play", { playerBlue, playerOrange, bSize, tLimit });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap p-3">
      <div className="px-3">
        <label className="pr-2">Blue player:</label>
        <select
          value={playerBlue}
          onChange={(event) => {
            setPlayerBlue(event.target.value);
          }}
          className="p-2 border border-gray-400"
        >
          <option value="human">Human</option>
          <option value="minimax">AI - Minimax</option>
          <option value="minimaxlocal">AI - Minimax + Local Search</option>
        </select>
      </div>
      <div className="px-3">
        <label className="pr-2">Orange player:</label>
        <select
          value={playerOrange}
          onChange={(event) => {
            setPlayerOrange(event.target.value);
          }}
          className="p-2 border border-gray-400"
        >
          <option value="human">Human</option>
          <option value="minimax">AI - Minimax</option>
          <option value="minimaxlocal">AI - Minimax + Local Search</option>
        </select>
      </div>
      <div className="px-3">
        <label className="pr-2">Board size:</label>
        <select
          value={bSize}
          onChange={(event) => {
            setBSize(event.target.value);
          }}
          className="p-2 border border-gray-400"
        >
          <option value={6}>6</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={16}>16</option>
        </select>
      </div>
      <div className="px-3">
        <label className="pr-2">Time limit for each turn (in seconds):</label>
        <input
          type="number"
          value={tLimit}
          onChange={(event) => {
            setTLimit(parseInt(event.target.value));
          }}
          className="p-2 border border-gray-400"
        />
      </div>
      <div className="px-3">
        <button type="submit" className="p-2 bg-blue-400 text-white rounded">
          Let's go!
        </button>
      </div>
    </form>
  );
};

export default Setting;
