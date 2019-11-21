import React from "react";

export default class Deck extends React.Component {
  render() {
    return (
      <div id="deck">
        <img
          onClick={this.props.playing ? () => this.props.drawDeck() : null}
          src={
            this.props.deckCard && this.props.deckCard.value !== "JOKER"
              ? this.props.deckCard.image
              : this.props.deckCard && this.props.deckCard.value === "JOKER"
              ? this.props.joker
              : this.props.cardBack
          }
        />
      </div>
    );
  }
}
