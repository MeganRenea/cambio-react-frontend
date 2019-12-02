import React from "react";
import emptyPic from "./backgroundImage.png";

export default class Card extends React.Component {
  emptyDivStyle = {
    height: "103.62px",
    width: "74.58px",
    // background: "white",
    position: "flex"
  };

  render() {
    return (
      <div id={this.props.position}>
        {this.props.card ? (
          <img
            className={this.props.card.selected ? "Selected" : "Not"}
            onClick={
              !this.props.power
                ? e =>
                    this.props.regularPlay(
                      e,
                      this.props.card,
                      this.props.position
                    )
                : this.props.power === "blindSwap"
                ? e =>
                    this.props.blindSwap(
                      e,
                      this.props.card,
                      this.props.position
                    )
                : this.props.power === "lookSwap"
                ? e =>
                    this.props.lookSwap(e, this.props.card, this.props.position)
                : this.props.power === "lookOther"
                ? e =>
                    this.props.lookOther(
                      e,
                      this.props.card,
                      this.props.position
                    )
                : e =>
                    this.props.lookSelf(e, this.props.card, this.props.position)
            }
            src={
              this.props.card.front && this.props.card.value === "JOKER"
                ? this.props.joker
                : this.props.card.front
                ? this.props.card.image
                : this.props.cardBack
            }
          />
        ) : (
          <img src={emptyPic} />
        )}
      </div>
    );
  }
}
