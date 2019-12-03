import React from "react";
import DiscardBack from "./discardBack.png";

export default class Discard extends React.Component {
  render() {
    return (
      <div id="discard">
        {this.props.playing ? (
          <img
            onClick={event =>
              this.props.discardCard(event, this.props.playedCard)
            }
            src={
              this.props.playedCard && this.props.playedCard.value !== "JOKER"
                ? this.props.playedCard.image
                : this.props.playedCard &&
                  this.props.playedCard.value === "JOKER"
                ? this.props.joker
                : DiscardBack
            }
          />
        ) : null}
      </div>
    );
  }
}
