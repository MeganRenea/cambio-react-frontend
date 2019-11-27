import React from "react";

export default class Computer extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.turn !== this.props.turn && this.props.turn === 2) {
      setTimeout(() => this.props.computerPlay(), 5000);
    }
    if (
      prevProps.computer2played !== this.props.computer2played &&
      this.props.computer2played === true
    ) {
      setTimeout(() => this.props.computerPlay(), 5000);
    }
    if (
      prevProps.computer3played !== this.props.computer3played &&
      this.props.computer3played === true
    ) {
      setTimeout(() => this.props.computerPlay(), 5000);
    }
    if (this.props.computer4played && this.props.p1Cambio) {
      this.props.gameOver();
    }
    if (this.props.computer4played) {
      this.props.resetPlay();
    }
    if (
      prevProps.topDiscard !== this.props.topDiscard &&
      !this.props.secondCard
    ) {
      setTimeout(() => {
        this.props.computerHit();
      }, 2000);
    }
    if (prevProps.automaticCambio !== this.props.automaticCambio) {
      let lastTurn = this.props.turn - 1;
      if (lastTurn < 1) {
        lastTurn = 4;
      }
      this.props.setLast(lastTurn);
    }
    if (
      !this.props.p1a &&
      !this.props.p1b &&
      !this.props.p1c &&
      !this.props.p1d &&
      !this.props.cambio &&
      this.props.playing &&
      this.props.turn !== 1
    ) {
      if (!this.props.cambio) {
        this.props.automaticCambioFunction("p1");
      } else if (this.state.cambio) {
        this.props.skipTurn();
      }
    }
  }
  //   play = () => {
  //     if (this.props.turn === 2 && !this.props.computer2played) {
  //       this.props.computerPlay();
  //       return null;
  //     } else if (this.props.turn === 3 && !this.props.computer3played) {
  //       this.props.computerPlay();
  //       return null;
  //     } else if (this.props.turn === 4 && !this.props.computer4played) {
  //       this.props.computerPlay();
  //       return null;
  //     } else {
  //       return null;
  //     }
  //   };

  render() {
    return null;
  }
}
