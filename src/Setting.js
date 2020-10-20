import React from "react";

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	playerBlue: 'human',
    	playerOrange: 'human',
    	bSize: 4,
    	tLimit: 10,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    // this.setState({value: event.target.value});
    // let player1 = event.target.blue;
    // let player2 = even.target.orange;
    // let boardSize = event.target.size;
    // let timeLimit = event.target.time;
    // this.setState({[player1]: player2});
    this.setState({
    	playerBlue: event.target.playerBlue,
    	playerOrange: event.target.playerOrange,
    	bSize: event.target.bSize,
    	tLimit: event.target.tLimit
    })
  }

  handleSubmit(event) {
    alert('Blue player is ' + this.state.blue + ' while orange player is ' + this.state.orange);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Blue player:
          <select value={this.state.playerBlue} onChange={this.handleChange}>
            <option value="human">Human</option>
            <option value="minimax">AI - Minimax</option>
            <option value="abpruning">AI - Alpha beta pruning</option>
          </select>
        </label>
        <label>
          Orange player:
          <select value={this.state.playerOrange} onChange={this.handleChange}>
            <option value="human">Human</option>
            <option value="minimax">AI - Minimax</option>
            <option value="abpruning">AI - Alpha beta pruning</option>
          </select>
        </label>
        <label>
          Board size:
          <select value={this.state.bSize} onChange={this.handleChange}>
            <option value="sizeFirst">4</option>
            <option value="sizeSecond">8</option>
            <option value="sizeThird">10</option>
            <option value="sizeFourth">16</option>
          </select>
        </label>
        <label>
        	Time limit for each turn (in seconds):
        	<input type = "number" value = {this.state.tLimit} onChange = {this.handleChange} />
        </label>
        <input type="submit" value="Start" />
      </form>
    );
  }
}
export default Setting;