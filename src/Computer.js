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
