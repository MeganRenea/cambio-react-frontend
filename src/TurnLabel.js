import React from "react";

export default class TurnLabel extends React.Component {
  active = {
    color: "red",
    textAlign: "center"
  };

  inactive = {
    textAlign: "center"
  };
  render() {
    return (
      <>
        <div id="player1">
          {this.props.turn === 1 ? (
            <h1 style={this.active}>Player 1</h1>
          ) : this.props.playing ? (
            <h1 style={this.inactive}>Player 1</h1>
          ) : null}
        </div>
        <div id="player2">
          {this.props.turn === 2 ? (
            <h1 style={this.active}>Player 2</h1>
          ) : this.props.playing ? (
            <h1 style={this.inactive}>Player 2</h1>
          ) : null}
        </div>
        <div id="player3">
          {this.props.turn === 3 ? (
            <h1 style={this.active}>Player 3</h1>
          ) : this.props.playing ? (
            <h1 style={this.inactive}>Player 3</h1>
          ) : null}
        </div>
        <div id="player4">
          {this.props.turn === 4 ? (
            <h1 style={this.active}>Player 4</h1>
          ) : this.props.playing ? (
            <h1 style={this.inactive}>Player 4</h1>
          ) : null}
        </div>
      </>
    );
  }
}
