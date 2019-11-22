import React from "react";

export default class TurnLabel extends React.Component {
  render() {
    return (
      <div
        id={
          this.props.turn === 1
            ? "player1"
            : this.props.turn === 2
            ? "player2"
            : this.props.turn === 3
            ? "player3"
            : "player4"
        }
      >
        {this.props.turn ? <h1>Player {this.props.turn}'s Turn</h1> : null}
      </div>
    );
  }
}
