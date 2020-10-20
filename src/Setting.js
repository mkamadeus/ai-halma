import React, { useState } from "react";
import {useHistory} from 'react-router-dom';

const Setting = () => {
  const [playerBlue, setPlayerBlue] = useState('human');
  const [playerOrange, setPlayerOrange] = useState('human');
  const [bSize, setBSize] = useState(4);
  const [tLimit, setTLimit] = useState(10);
  const history = useHistory();

  const handleChange = (event) => 
    {setPlayerBlue(event.target.playerBlue);
    setPlayerOrange(event.target.playerOrange);
    setBSize(event.target.bSize);
    setTLimit(event.target.tLimit);};

  const handleSubmit = (event) => {
    history.push('/play');
    alert('Blue player is ' + this.state.blue + ' while orange player is ' + this.state.orange);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Blue player:
        <select value={playerBlue} onChange={handleChange}>
          <option value="human">Human</option>
          <option value="minimax">AI - Minimax</option>
          <option value="abpruning">AI - Alpha beta pruning</option>
        </select>
      </label>
      <label>
        Orange player:
        <select value={playerOrange} onChange={handleChange}>
          <option value="human">Human</option>
          <option value="minimax">AI - Minimax</option>
          <option value="abpruning">AI - Alpha beta pruning</option>
        </select>
      </label>
      <label>
        Board size:
        <select value={bSize} onChange={handleChange}>
          <option value="sizeFirst">4</option>
          <option value="sizeSecond">8</option>
          <option value="sizeThird">10</option>
          <option value="sizeFourth">16</option>
        </select>
      </label>
      <label>
        Time limit for each turn (in seconds):
        <input type = "number" value = {tLimit} onChange = {handleChange} />
      </label>
      <input type="submit" value="Start" />
    </form>  )
};

export default Setting;