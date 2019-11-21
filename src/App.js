import React from "react";
import "./App.css";
import "./index.css";
import Card from "./Card";
import cardBack from "./cardBack.png";
import joker from "./joker.png";
import Deck from "./Deck";
import Discard from "./Discard";

class App extends React.Component {
  state = {
    deck_id: null,
    playing: false,
    cards: {
      p1a: null,
      p1b: null,
      p1c: null,
      p1d: null,
      p2a: null,
      p2b: null,
      p2c: null,
      p2d: null,
      p3a: null,
      p3b: null,
      p3c: null,
      p3d: null,
      p4a: null,
      p4b: null,
      p4c: null,
      p4d: null
    },
    points: {
      JOKER: -1,
      ACE: 1,
      QUEEN: 10,
      KING: 10,
      JACK: 10
    },
    p2: { p2a: null, p2b: null, p2c: null, p2d: null },
    p3: { p3a: null, p3b: null, p3c: null, p3d: null },
    p4: { p4a: null, p4b: null, p4c: null, p4d: null },
    prevDeckCard: null,
    deckCard: null,
    playedCard: null,
    selectedCardA: null,
    selectedCardB: null,
    topDiscard: null,
    currentTurn: 1,
    secondCard: false,
    remaining: null,
    power: null
  };

  drawDeck = () => {
    fetch(
      `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=1`
    )
      .then(resp => resp.json())
      .then(json =>
        this.setState({ deckCard: json.cards[0], secondCard: false })
      );
  };

  blindSwap = (event, card, position) => {
    console.log("in blind swap");
    if (!this.state.selectedCardA || !this.state.selectedCardB) {
      if (event.target.className !== "Selected") {
        if (!this.state.selectedCardA) {
          this.setState({ selectedCardA: { [position]: card } });
        } else if (this.state.selectedCardA && !this.state.selectedCardB) {
          this.setState({ selectedCardB: { [position]: card } });
        }
        event.target.className = "Selected";
      }
    }
    if (this.state.selectedCardA && this.state.selectedCardB) {
      let positionA = Object.keys(this.state.selectedCardA)[0];
      let positionB = Object.keys(this.state.selectedCardB)[0];
      this.setState(prevState => ({
        cards: Object.assign(prevState.cards, {
          [positionA]: prevState.selectedCardB[positionB],
          [positionB]: prevState.selectedCardA[positionA]
        }),
        selectedCardA: null,
        selectedCardB: null,
        power: null
      }));
      Array.from(document.querySelectorAll(".Selected")).map(
        item => (item.className = "Not")
      );
      alert("Swapped!");
    }
  };

  lookSwap = (event, card, position) => {
    console.log("in look and swap");
    if (!this.state.selectedCardA || !this.state.selectedCardB) {
      if (event.target.className !== "Selected") {
        if (!this.state.selectedCardA) {
          this.setState({ selectedCardA: { [position]: card } });
        } else if (this.state.selectedCardA && !this.state.selectedCardB) {
          this.setState({ selectedCardB: { [position]: card } });
        }
        event.target.className = "Selected";
      }
    }
    if (this.state.selectedCardA && this.state.selectedCardB) {
      let positionA = Object.keys(this.state.selectedCardA)[0];
      let positionB = Object.keys(this.state.selectedCardB)[0];
      this.setState(prevState => ({
        cards: Object.assign(prevState.cards, {
          [positionA]: prevState.selectedCardB[positionB],
          [positionB]: prevState.selectedCardA[positionA]
        }),
        selectedCardA: null,
        selectedCardB: null,
        power: null
      }));
      Array.from(document.querySelectorAll(".Selected")).map(
        item => (item.className = "Not")
      );
      alert("Swapped!");
    }
  };

  regularPlay = (event, card, position) => {
    console.log("in regular play");
    let p1Cards = ["p1a", "p1b", "p1c", "p1d"];
    // if(event.target.className === "Selected"){
    //   console.log("right")
    //   event.target.className = "Not"
    // }
    if (p1Cards.includes(position) && this.state.deckCard) {
      fetch(
        `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${card.code}`
      );

      this.setState(prevState => ({
        topDiscard: card,
        selectedCardA: null,
        playedCard: card,
        deckCard: null,
        cards: Object.assign(prevState.cards, {
          [position]: prevState.deckCard
        })
      }));
    } else if (this.state.topDiscard && !this.state.secondCard) {
      this.setState({ selectedCardA: { [position]: card } });
      event.target.className = "Selected";
      //change view of card
      if (card.value === this.state.topDiscard.value) {
        fetch(
          `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${card.code}`
        );
        this.setState(prevState => ({
          secondCard: true,
          cards: Object.assign(prevState.cards, { [position]: null }),
          topDiscard: card,
          selectedCardA: null
        }));
      } else {
        console.log("wrong");
        event.persist();
        setTimeout(() => {
          event.target.className = "Not";
          this.setState({ selectedCardA: null });
        }, 1000);
      }
    }
  };

  lookSelf = (event, card, position) => {
    console.log("in look self");
    let p1Cards = ["p1a", "p1b", "p1c", "p1d"];
    if (p1Cards.includes(position) & !this.state.selectedCardA) {
      if (event.target.className !== "Selected") {
        this.setState({ selectedCardA: { [position]: card } });
      }
      event.target.className = "Selected";
      event.persist();
      setTimeout(() => {
        event.target.className = "Not";
        this.setState({ selectedCardA: null, power: null });
      }, 5000);
    }
  };

  lookOther = (event, card, position) => {
    console.log("in look other");

    let p1Cards = ["p1a", "p1b", "p1c", "p1d"];
    if (!p1Cards.includes(position) & !this.state.selectedCardA) {
      if (event.target.className !== "Selected") {
        this.setState({ selectedCardA: { [position]: card } });
      }
      event.target.className = "Selected";
      event.persist();
      setTimeout(() => {
        event.target.className = "Not";
        this.setState({ selectedCardA: null, power: null });
      }, 5000);
    }
  };

  discardCard = () => {
    if (this.state.deckCard) {
      fetch(
        `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${this.state.deckCard.code}`
      );

      if (
        this.state.deckCard.code === "KS" ||
        this.state.deckCard.code === "KC"
      ) {
        this.setState({ power: "lookSwap" });
      } else if (
        this.state.deckCard.value === "QUEEN" ||
        this.state.deckCard.value === "JACK"
      ) {
        this.setState({ power: "blindSwap" });
      } else if (
        this.state.deckCard.value === "8" ||
        this.state.deckCard.value === "7"
      ) {
        this.setState({ power: "lookSelf" });
      } else if (
        this.state.deckCard.value === "9" ||
        this.state.deckCard.value === "10"
      ) {
        this.setState({ power: "lookOther" });
      } else {
        this.setState({ power: null });
      }

      this.setState(prevState => ({
        secondCard: false,
        prevDeckCard: prevState.deckCard,
        topDiscard: prevState.deckCard,
        selectedCardA: null,
        playedCard: prevState.deckCard,
        deckCard: null
      }));
    }

    // else if(this.state.selectedCardA){
    //   fetch(`https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${this.state.selectedCardA.code}`)
    //   let position = Object.keys(this.state.selectedCardA)
    //   this.setState(prevState => ({cards: Object.assign(prevState.cards, {[position]:null}),topDiscard: prevState.selectedCardA[position], selectedCardA: null,  deckCard:null}))
    // }
  };

  componentDidMount() {
    fetch("https://deckofcardsapi.com/api/deck/new/?jokers_enabled=true", {})
      .then(resp => resp.json())
      .then(json =>
        this.setState({ deck_id: json.deck_id, remaining: json.remaining })
      );
  }

  renderCards = () => {
    return Object.keys(this.state.cards).map(key => {
      return (
        <Card
          card={this.state.cards[key]}
          position={key}
          joker={joker}
          blindSwap={this.blindSwap}
          regularPlay={this.regularPlay}
          lookOther={this.lookOther}
          playedCard={this.state.playedCard}
          deckCard={this.state.deckCard}
          lookSwap={this.lookSwap}
          lookSelf={this.lookSelf}
          prevDeckCard={this.state.prevDeckCard}
          power={this.state.power}
        />
      );
    });
  };

  play = () => {
    fetch(
      `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/shuffle/?jokers_enabled=true`
    )
      .then(resp => resp.json())
      .then(json => {
        this.setState({ playing: true });
        this.dealCards();
      });
  };

  dealCards = () => {
    fetch(
      `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=16`
    )
      .then(resp => resp.json())
      .then(json => {
        this.setState({ remaining: json.remaining });
        let newObj = {};
        let i = 0;
        Object.keys(this.state.cards).forEach(function(key) {
          newObj[key] = json.cards[i];
          i += 1;
          return newObj;
        });
        let p4 = { p4a: newObj.p4a, p4b: newObj.p4b };
        let p3 = { p3a: newObj.p3a, p3b: newObj.p3b };
        let p2 = { p2a: newObj.p2a, p2b: newObj.p2b };
        this.setState(prevState => ({
          cards: { ...newObj },
          p2: Object.assign(prevState.p2, p2),
          p3: Object.assign(prevState.p3, p3),
          p4: Object.assign(prevState.p4, p4)
        }));
      });
  };

  render() {
    return (
      <div className="app">
        {!this.state.playing ? <button onClick={this.play}>Play</button> : null}
        {this.state.playing ? this.renderCards() : null}
        <Deck
          cardBack={cardBack}
          playing={this.state.playing}
          deckCard={this.state.deckCard}
          drawDeck={this.drawDeck}
          joker={joker}
          remaining={this.state.remaining}
        />
        <Discard
          playedCard={this.state.topDiscard}
          discardCard={this.discardCard}
          playing={this.state.playing}
          cardBack={cardBack}
          joker={joker}
        />
      </div>
    );
  }
}
export default App;
