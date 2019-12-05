import React from "react";
import deckBack from "./deckBack.png";

export default class Deck extends React.Component {
  render() {
    return (
      <div id="deck">
        <img
          className={
            this.props.deckCard && this.props.deckCard.deckSelect
              ? "Selected"
              : "Not"
          }
          onClick={() => this.props.drawDeck()}
          src={
            this.props.deckCard &&
            this.props.deckCard.deckfront &&
            this.props.deckCard.value !== "JOKER"
              ? this.props.deckCard.image
              : this.props.deckCard &&
                this.props.deckCard.deckfront &&
                this.props.deckCard.value === "JOKER"
              ? this.props.joker
              : deckBack
          }
        />
      </div>
    );
  }
}
