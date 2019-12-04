import React from "react";
import "./App.css";
import "./index.css";
import Card from "./Card";
import cardBack from "./cardBack.png";
import joker from "./joker.png";
import Deck from "./Deck";
import Discard from "./Discard";
import TurnLabel from "./TurnLabel";
import Computer from "./Computer";
import { Modal, Button } from "react-bootstrap";
import cambio from "./cambio.gif";

class App extends React.Component {
  state = {
    rules: false,
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
      KC: 10,
      KS: 10,
      KH: 0,
      KD: 0,
      JACK: 10,
      "10": 10,
      "9": 9,
      "8": 8,
      "7": 7,
      "6": 6,
      "5": 5,
      "4": 4,
      "3": 3,
      "2": 2
    },
    p2: { p2a: null, p2b: null, p2c: null, p2d: null },
    p3: { p3a: null, p3b: null, p3c: null, p3d: null },
    p4: { p4a: null, p4b: null, p4c: null, p4d: null },
    p1: {},
    prevDeckCard: null,
    deckCard: null,
    playedCard: null,
    selectedCardA: null,
    selectedCardB: null,
    topDiscard: null,
    currentTurn: null,
    secondCard: false,
    remaining: null,
    power: null,
    computer2played: false,
    computer3played: false,
    computer4played: false,
    cambio: false,
    automaticCambio: false,
    firstTime: true
  };

  turn = false;

  drawDeck = () => {
    if (this.state.currentTurn === 1) {
      fetch(
        `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=1`
      )
        .then(resp => resp.json())
        .then(json =>
          this.setState({ deckCard: json.cards[0], secondCard: false })
        );
    }
  };

  countPoints = playerHand => {
    let cards = Object.values(playerHand).filter(card => card !== null);
    console.log("in Handpoints cards", cards);
    let cardValueKeys = cards.map(card => {
      if (card.value === "KING") {
        return card.code;
      } else {
        return card.value;
      }
    });
    console.log("in Handpoints cardvalue keys", cardValueKeys);
    let cardValues = cardValueKeys.map(
      cardValueKey => this.state.points[cardValueKey]
    );
    console.log("in Handpoints cardvalues", cardValues);
    let handPoints = cardValues.reduce(function(total, value) {
      return total + value;
    }, 0);
    console.log("hand points ", handPoints);
    return handPoints;
  };

  cambioDeleteCards = () => {
    let allcards = { ...this.state.cards };
    if (this.state.cambioCaller) {
      let cambioCallerCardPositions = [
        `${this.state.cambioCaller}a`,
        `${this.state.cambioCaller}b`,
        `${this.state.cambioCaller}c`,
        `${this.state.cambioCaller}d`
      ];
      for (let i = 0; i < cambioCallerCardPositions.length; i++) {
        delete allcards[cambioCallerCardPositions[i]];
      }
      return allcards;
    } else {
      return allcards;
    }
  };

  computerPlay = () => {
    let computerKnows;
    let computer;
    let played;
    let handPoints;
    let nextTurn = this.state.currentTurn + 1;
    if (nextTurn > 4) {
      nextTurn = 1;
    }

    if (this.state.currentTurn === 2) {
      computerKnows = this.state.p2;
      computer = "p2";
      played = "computer2played";
    } else if (this.state.currentTurn === 3) {
      computerKnows = this.state.p3;
      computer = "p3";
      played = "computer3played";
    } else if (this.state.currentTurn === 4) {
      computerKnows = this.state.p4;
      computer = "p4";
      played = "computer4played";
    }
    let computerHandPositions = [
      `${computer}a`,
      `${computer}b`,
      `${computer}c`,
      `${computer}d`
    ];
    let emptyHand = computerHandPositions
      .map(position => this.state.cards[position])
      .every(card => card === null);

    let AllcomputerHandPositions = [
      ["p2a", "p2b", "p2c", "p2d"],
      ["p3a", "p3b", "p3c", "p3d"],
      ["p4a", "p4b", "p4c", "p4d"]
    ];
    let areTheyEmpty = AllcomputerHandPositions.map(computer =>
      computer.map(position => {
        return this.state.cards[position];
      })
    ).map(computer => computer.every(value => value === null));

    if (areTheyEmpty[0] && !this.state.cambio) {
      this.automaticCambio("p2");
    } else if (areTheyEmpty[1] && !this.state.cambio) {
      this.automaticCambio("p3");
    } else if (areTheyEmpty[2] && !this.state.cambio) {
      this.automaticCambio("p4");
    }

    if (emptyHand && this.state.cambio && !this.state[computer]["last"]) {
      this.setState({ currentTurn: nextTurn });
    }
    handPoints = this.countPoints(computerKnows);
    console.log(`${computer} Hand points `, handPoints);
    if (
      !Object.values(computerKnows).includes(null) &&
      handPoints < 5 &&
      !this.state.cambio
    ) {
      alert(`${computer} says CAMBIO`);
      this.setState({
        currentTurn: nextTurn,
        [computer]: Object.assign(this.state[computer], { last: true }),
        cambio: true,
        [played]: true,
        cambioCaller: computer
      });
    } else if (!this.state[computer]["last"]) {
      if (Object.values(computerKnows).includes(null) && !this.state[played]) {
        console.log(`${computer} is going`);
        Promise.resolve(
          fetch(
            `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=1`
          )
            .then(resp => resp.json())
            .then(json => {
              console.log(`${computer} is drawing`);
              this.setState({
                deckCard: json.cards[0],
                secondCard: false,
                remaining: json.remaining
              });
            })
        ).then(() => {
          setTimeout(() => {
            console.log(`in ${computer}'s turn`);
            let newPosition = Object.keys(computerKnows).find(
              key => computerKnows[key] === null
            );
            let card = this.state.cards[newPosition];
            fetch(
              `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${card.code}`
            )
              .then(resp => resp.json())
              .then(json => this.setState({ remaining: json.remaining }));

            this.setState({
              currentTurn: nextTurn,
              secondCard: false,
              [played]: true,
              topDiscard: card,
              playedCard: card,
              deckCard: null,
              cards: Object.assign(this.state.cards, {
                [newPosition]: this.state.deckCard
              }),
              [computer]: Object.assign(this.state[computer], {
                [newPosition]: this.state.deckCard
              })
            });
          }, 5000);
        });
      } else if (!this.state[played]) {
        Promise.resolve(
          fetch(
            `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=1`
          )
            .then(resp => resp.json())
            .then(json => {
              console.log(`${computer} is drawing`);
              this.setState({
                deckCard: json.cards[0],
                secondCard: false,
                remaining: json.remaining
              });
            })
        ).then(() => {
          setTimeout(() => {
            let cards = Object.values(computerKnows);
            let cardValues = cards.map(card => {
              if (card.value === "KING") {
                return card.code;
              } else {
                return card.value;
              }
            });
            console.log("cardValues ", cardValues);
            let deckCardValue;
            if (this.state.deckCard.value === "KING") {
              deckCardValue = this.state.deckCard.code;
            } else {
              deckCardValue = this.state.deckCard.value;
            }
            console.log("deck card value ", deckCardValue);
            let higherCardValue = cardValues.find(
              value =>
                this.state.points[value] > this.state.points[deckCardValue]
            );
            console.log("higher card value ", higherCardValue);
            let higherCard = cards.find(
              card =>
                card.value === higherCardValue || card.code === higherCardValue
            );
            console.log("higher card", higherCard);
            let higherCardPosition = Object.keys(computerKnows).find(
              key => computerKnows[key] === higherCard
            );
            if (higherCard) {
              fetch(
                `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${higherCard.code}`
              )
                .then(resp => resp.json())
                .then(json => this.setState({ remaining: json.remaining }));

              this.setState({
                currentTurn: nextTurn,
                [played]: true,
                topDiscard: higherCard,
                playedCard: higherCard,
                deckCard: null,
                cards: Object.assign(this.state.cards, {
                  [higherCardPosition]: this.state.deckCard
                }),
                [computer]: Object.assign(this.state[computer], {
                  [higherCardPosition]: this.state.deckCard
                })
              });
            } else {
              Promise.resolve(
                fetch(
                  `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${this.state.deckCard.code}`
                )
                  .then(resp => resp.json())
                  .then(json =>
                    this.setState(prevState => ({
                      remaining: json.remaining,
                      secondCard: false,
                      prevDeckCard: prevState.deckCard,
                      topDiscard: prevState.deckCard,
                      selectedCardA: null,
                      playedCard: prevState.deckCard,
                      deckCard: null
                    }))
                  )
              ).then(() => {
                if (
                  this.state.prevDeckCard.code === "KS" ||
                  this.state.prevDeckCard.code === "KC"
                ) {
                  setTimeout(() => {
                    console.log("lookSwap");
                    let allcards = this.cambioDeleteCards();
                    for (let position in computerKnows) {
                      delete allcards[position];
                    }
                    let allCardsPositions = Object.keys(allcards).filter(
                      position => allcards[position] !== null
                    );
                    let randomIndex = Math.floor(
                      Math.random() * allCardsPositions.length
                    );
                    let randomCardPosition = allCardsPositions[randomIndex];
                    let randomCard = allcards[randomCardPosition];
                    let computerCards = Object.values(computerKnows);
                    let computerCardValues = computerCards.map(card => {
                      if (card.value === "KING") {
                        return card.code;
                      } else {
                        return card.value;
                      }
                    });
                    let cardValue;
                    if (randomCard.value === "KING") {
                      cardValue = randomCard.code;
                    } else {
                      cardValue = randomCard.value;
                    }
                    let higherCardValue = computerCardValues.find(
                      value =>
                        this.state.points[value] > this.state.points[cardValue]
                    );
                    let higherCard = computerCards.find(
                      card => card.value === higherCardValue
                    );
                    let higherCardPosition = Object.keys(computerKnows).find(
                      key => computerKnows[key] === higherCard
                    );
                    let randomCardPlayer = randomCardPosition.slice(0, 2);

                    if (higherCard) {
                      this.setState(prevState => ({
                        cards: Object.assign(prevState.cards, {
                          [higherCardPosition]: {
                            ...randomCard,
                            selected: true
                          },
                          [randomCardPosition]: {
                            ...higherCard,
                            selected: true
                          }
                        }),
                        [computer]: Object.assign(prevState[computer], {
                          [higherCardPosition]: randomCard,
                          [randomCardPosition]: higherCard
                        }),
                        currentTurn: nextTurn,
                        [played]: true,
                        [randomCardPlayer]: Object.assign(prevState[computer], {
                          [higherCardPosition]: randomCard,
                          [randomCardPosition]: null
                        })
                      }));
                      setTimeout(() => {
                        this.setState(prevState => ({
                          cards: Object.assign(prevState.cards, {
                            [higherCardPosition]: {
                              ...randomCard,
                              selected: false
                            },
                            [randomCardPosition]: {
                              ...higherCard,
                              selected: false
                            }
                          })
                        }));
                        alert("Swapped!");
                      }, 2000);
                    } else {
                      this.setState(prevState => ({
                        cards: Object.assign(prevState.cards, {
                          [randomCardPosition]: {
                            ...randomCard,
                            selected: true
                          }
                        }),
                        [computer]: Object.assign(prevState[computer], {
                          [randomCardPosition]: randomCard
                        }),
                        currentTurn: nextTurn,
                        [played]: true
                      }));
                      setTimeout(() => {
                        this.setState(prevState => ({
                          cards: Object.assign(prevState.cards, {
                            [randomCardPosition]: {
                              ...randomCard,
                              selected: false
                            }
                          })
                        }));
                        alert("Did not swap");
                      }, 2000);
                    }
                  }, 5000);
                } else if (
                  this.state.prevDeckCard.value === "QUEEN" ||
                  this.state.prevDeckCard.value === "JACK"
                ) {
                  console.log("blindSwap");
                  setTimeout(() => {
                    let allcards = this.cambioDeleteCards();
                    console.log("all cards ", allcards);
                    for (let position in computerKnows) {
                      delete allcards[position];
                    }
                    let allCardsPositions = Object.keys(allcards).filter(
                      position => allcards[position] !== null
                    );
                    console.log("some deleted all cards ", allcards);

                    let randomIndex1 = Math.floor(
                      Math.random() * allCardsPositions.length
                    );
                    console.log("random index1 ", randomIndex1);
                    let randomIndex2 = Math.floor(
                      Math.random() * allCardsPositions.length
                    );

                    if (randomIndex1 === randomIndex2) {
                      randomIndex2 = Math.floor(
                        Math.random() * allCardsPositions.length
                      );
                    }
                    console.log("random index2 ", randomIndex2);
                    let randomCardPosition1 = allCardsPositions[randomIndex1];
                    console.log("random position1 ", randomCardPosition1);
                    let randomCardPosition2 = allCardsPositions[randomIndex2];
                    console.log("random position2 ", randomCardPosition2);
                    let randomCard1 = allcards[randomCardPosition1];
                    console.log("random card 1", randomCard1);
                    let randomCard2 = allcards[randomCardPosition2];
                    console.log("random card 2", randomCard2);
                    let player1 = randomCardPosition1.slice(0, 2);
                    let player2 = randomCardPosition2.slice(0, 2);
                    this.setState(prevState => ({
                      cards: Object.assign(prevState.cards, {
                        [randomCardPosition1]: {
                          ...randomCard2,
                          selected: true
                        },
                        [randomCardPosition2]: {
                          ...randomCard1,
                          selected: true
                        }
                      }),
                      [player1]: Object.assign(prevState[player1], {
                        [randomCardPosition1]: null,
                        [randomCardPosition2]: randomCard1
                      }),
                      [player2]: Object.assign(prevState[player2], {
                        [randomCardPosition2]: null,
                        [randomCardPosition1]: randomCard2
                      }),
                      currentTurn: nextTurn,
                      [played]: true
                    }));
                    setTimeout(() => {
                      this.setState(prevState => ({
                        cards: Object.assign(prevState.cards, {
                          [randomCardPosition1]: {
                            ...randomCard2,
                            selected: false
                          },
                          [randomCardPosition2]: {
                            ...randomCard1,
                            selected: false
                          }
                        })
                      }));
                      alert("Swapped!");
                    }, 2000);
                  }, 5000);
                } else if (
                  this.state.prevDeckCard.value === "8" ||
                  this.state.prevDeckCard.value === "7"
                ) {
                  console.log("lookSelf");
                  setTimeout(() => {
                    this.setState({ currentTurn: nextTurn, [played]: true });
                  }, 5000);
                } else if (
                  this.state.prevDeckCard.value === "9" ||
                  this.state.prevDeckCard.value === "10"
                ) {
                  console.log("lookOther");
                  setTimeout(() => {
                    let allcards = this.cambioDeleteCards();
                    for (let position in computerKnows) {
                      delete allcards[position];
                    }
                    console.log("In look other all cards", allcards);
                    let allCardsPositions = Object.keys(allcards).filter(
                      position => allcards[position] !== null
                    );
                    console.log(
                      "In look other all cards positions",
                      allCardsPositions
                    );
                    let randomIndex = Math.floor(
                      Math.random() * allCardsPositions.length
                    );
                    console.log("random index", randomIndex);
                    let randomCardPosition = allCardsPositions[randomIndex];
                    console.log("random card position", randomCardPosition);
                    let randomCard = allcards[randomCardPosition];
                    console.log("random card", randomCard);
                    this.setState(prevState => ({
                      cards: Object.assign(prevState.cards, {
                        [randomCardPosition]: { ...randomCard, selected: true }
                      }),
                      [computer]: Object.assign(prevState[computer], {
                        [randomCardPosition]: randomCard
                      }),
                      [played]: true,
                      currentTurn: nextTurn
                    }));
                    setTimeout(() => {
                      this.setState(prevState => ({
                        cards: Object.assign(prevState.cards, {
                          [randomCardPosition]: {
                            ...randomCard,
                            selected: false
                          }
                        })
                      }));
                    }, 2000);
                  }, 5000);
                } else {
                  console.log("No power");
                  setTimeout(() => {
                    this.setState({ currentTurn: nextTurn, [played]: true });
                  }, 5000);
                }
              });
            }
          }, 5000);
        });
      }
    } else {
      this.gameOver();
    }
  };
  gameOver = () => {
    let p1Cards = {
      p1a: this.state.cards.p1a,
      p1b: this.state.cards.p1b,
      p1c: this.state.cards.p1c,
      p1d: this.state.cards.p1d
    };
    let p2Cards = {
      p2a: this.state.cards.p2a,
      p2b: this.state.cards.p2b,
      p2c: this.state.cards.p2c,
      p2d: this.state.cards.p2d
    };
    let p3Cards = {
      p3a: this.state.cards.p3a,
      p3b: this.state.cards.p3b,
      p3c: this.state.cards.p3c,
      p3d: this.state.cards.p3d
    };
    let p4Cards = {
      p4a: this.state.cards.p4a,
      p4b: this.state.cards.p4b,
      p4c: this.state.cards.p4c,
      p4d: this.state.cards.p4d
    };

    let allCards = {};
    for (let key in this.state.cards) {
      if (this.state.cards[key]) {
        allCards[key] = { ...this.state.cards[key], front: true };
      }
    }
    let playerpoints = {
      You: this.countPoints(p1Cards),
      Player2: this.countPoints(p2Cards),
      Player3: this.countPoints(p3Cards),
      Player4: this.countPoints(p4Cards)
    };
    let winningPoints = Math.min(...Object.values(playerpoints));
    let winners = Object.keys(playerpoints).filter(
      player => playerpoints[player] === winningPoints
    );
    Promise.resolve(
      this.setState(prevState => ({
        cards: Object.assign(prevState.cards, allCards)
      }))
    ).then(() => {
      let cambioCaller = this.state.cambioCaller;
      let cambioCallerCards = Object.assign(this.state[cambioCaller], {
        [`${cambioCaller}a`]: null,
        [`${cambioCaller}b`]: null,
        [`${cambioCaller}c`]: null,
        [`${cambioCaller}d`]: null
      });
      delete cambioCallerCards["last"];
      setTimeout(
        () =>
          this.setState(prevState => ({
            rules: false,
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
              KC: 10,
              KS: 10,
              KH: 0,
              KD: 0,
              JACK: 10,
              "10": 10,
              "9": 9,
              "8": 8,
              "7": 7,
              "6": 6,
              "5": 5,
              "4": 4,
              "3": 3,
              "2": 2
            },
            p2: { p2a: null, p2b: null, p2c: null, p2d: null },
            p3: { p3a: null, p3b: null, p3c: null, p3d: null },
            p4: { p4a: null, p4b: null, p4c: null, p4d: null },
            p1: {},
            prevDeckCard: null,
            deckCard: null,
            playedCard: null,
            selectedCardA: null,
            selectedCardB: null,
            topDiscard: null,
            currentTurn: null,
            secondCard: false,
            remaining: null,
            power: null,
            computer2played: false,
            computer3played: false,
            computer4played: false,
            cambio: false,
            automaticCambio: false,
            firstTime: true
          })),
        4000
      );
    });
    winners[0] === "You"
      ? alert(`Congratulations! You win with ${winningPoints} points!`)
      : alert(`GameOver: ${winners} wins with ${winningPoints} points!`);
  };

  computerHit = () => {
    let computerKnows = [
      { p2: this.state.p2 },
      { p3: this.state.p3 },
      { p4: this.state.p4 }
    ];
    if (this.state.cambioCaller) {
      computerKnows = computerKnows.map(computer => {
        if (Object.keys(computer)[0] === this.state.cambioCaller) {
          delete computer[this.state.cambioCaller];
        } else {
          return {
            [Object.keys(computer)[0]]: this.state[Object.keys(computer)[0]]
          };
        }
      });
    }

    if (this.state.topDiscard && !this.state.secondCard) {
      let matchingCardArray = computerKnows.map(computer => {
        if (computer) {
          let cards = Object.values(computer)[0];

          let matchingCard = Object.values(cards).find(
            card => card && card.value === this.state.topDiscard.value
          );
          let position = Object.keys(cards).find(
            key => cards[key] === matchingCard
          );
          if (matchingCard) {
            return { [position]: matchingCard };
          }
        } else {
          return null;
        }
      });
      let matchingCardObject = matchingCardArray.find(card => card);

      if (matchingCardObject) {
        let matchingCard = Object.values(matchingCardObject)[0];
        console.log("matching card", matchingCard);
        let position = Object.keys(matchingCardObject)[0];
        let actualCard = this.state.cards[position];
        console.log("actual card", actualCard);
        let player = position.slice(0, 2);
        if (!this.state.secondCard && matchingCard === actualCard) {
          setTimeout(() => {
            let cards = this.state[player];
            delete cards[position];
            fetch(
              `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${matchingCard.code}`
            );
            this.setState(prevState => ({
              secondCard: true,
              cards: Object.assign(prevState.cards, { [position]: null }),
              topDiscard: matchingCard,
              [player]: cards,
              selectedCardA: null
            }));
          }, 4000);
        }
      }
    }
  };

  automaticCambio = player => {
    this.setState({
      cambio: true,
      automaticCambio: true,
      cambioCaller: player
    });

    alert("Cambio out! Last turn around.");
  };

  setLast = turn => {
    let player = `p${turn}`;
    this.setState({ [player]: { last: true } });
  };

  resetPlay = () => {
    this.setState({
      computer2played: false,
      computer3played: false,
      computer4played: false,
      deckCard: null
    });
  };

  blindSwap = (event, card, position) => {
    console.log("in blind swap");
    if (!this.state.selectedCardA || !this.state.selectedCardB) {
      if (!this.state.selectedCardA) {
        event.target.className = "Selected";
        console.log("clicked");
        this.setState({ selectedCardA: { [position]: card } });
      } else if (this.state.selectedCardA && !this.state.selectedCardB) {
        event.target.className = "Selected";
        Promise.resolve(
          this.setState({ selectedCardB: { [position]: card } })
        ).then(() => {
          let positionA = Object.keys(this.state.selectedCardA)[0];
          let positionB = Object.keys(this.state.selectedCardB)[0];
          let player1 = positionA.slice(0, 2);
          let player2 = positionB.slice(0, 2);
          this.setState(prevState => ({
            cards: Object.assign(prevState.cards, {
              [positionA]: prevState.selectedCardB[positionB],
              [positionB]: prevState.selectedCardA[positionA]
            }),
            selectedCardA: null,
            selectedCardB: null,
            [player1]: Object.assign(prevState[player1], {
              [positionA]: null
            }),
            [player2]: Object.assign(prevState[player2], {
              [positionB]: null
            }),
            power: null,

            currentTurn: prevState.currentTurn + 1
          }));

          Array.from(document.querySelectorAll(".Selected")).map(
            item => (item.className = "Not")
          );
          alert("Swapped!");
        });
      }
    }
  };

  lookSwap = (event, card, position) => {
    console.log("in look and swap");
    let p1Positions = ["p1a", "p1b", "p1c", "p1d"];
    if (!this.state.selectedCardA || !this.state.selectedCardB) {
      if (!this.state.selectedCardA && !p1Positions.includes(position)) {
        console.log("clicked");
        event.target.className = "Selected";
        Promise.resolve(
          this.setState(prevState => ({
            selectedCardA: { [position]: card },
            cards: Object.assign(prevState.cards, {
              [position]: { ...card, front: true }
            })
          }))
        );
      }
      if (this.state.selectedCardA && !this.state.selectedCardB) {
        event.target.className = "Selected";
        Promise.resolve(
          this.setState({ selectedCardB: { [position]: card } })
        ).then(() => {
          let positionA = Object.keys(this.state.selectedCardA)[0];
          let positionB = Object.keys(this.state.selectedCardB)[0];
          let player1 = positionA.slice(0, 2);
          let player2 = positionB.slice(0, 2);
          this.setState(prevState => ({
            cards: Object.assign(prevState.cards, {
              [positionA]: {
                ...prevState.selectedCardB[positionB],
                front: false
              },
              [positionB]: {
                ...prevState.selectedCardA[positionA],
                front: false
              }
            }),
            selectedCardA: null,
            selectedCardB: null,
            [player1]: Object.assign(prevState[player1], {
              [positionA]: null,
              [positionB]: prevState.selectedCardA[positionA]
            }),
            [player2]: Object.assign(prevState[player2], {
              [positionB]: null,
              [positionA]: prevState.selectedCardB[positionB]
            }),
            power: null,

            currentTurn: prevState.currentTurn + 1
          }));

          Array.from(document.querySelectorAll(".Selected")).map(
            item => (item.className = "Not")
          );
          alert("Swapped!");
        });
      }
    }
  };

  regularPlay = (event, card, position) => {
    console.log("in regular play");
    let p1Cards = ["p1a", "p1b", "p1c", "p1d"];
    // if(event.target.className === "Selected"){
    //   console.log("right")
    //   event.target.className = "Not"
    // }
    let noCards = p1Cards
      .map(position => this.state.cards[position])
      .every(card => card === null);
    console.log("p1 no cards?", noCards);
    if (noCards && !this.state.cambio) {
      this.automaticCambio("p1");
    } else if (noCards && this.state.cambio) {
      this.setState({ currentTurn: 2 });
    }
    if (
      p1Cards.includes(position) &&
      this.state.deckCard &&
      this.state.currentTurn === 1
    ) {
      fetch(
        `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${card.code}`
      );

      this.setState(prevState => ({
        topDiscard: card,
        selectedCardA: null,
        playedCard: card,
        deckCard: null,
        currentTurn: prevState.currentTurn + 1,
        cards: Object.assign(prevState.cards, {
          [position]: prevState.deckCard
        })
      }));
    } else if (this.state.topDiscard && !this.state.secondCard) {
      this.setState({ selectedCardA: { [position]: card } });
      event.target.className = "Selected";
      //change view of card
      if (card.value === this.state.topDiscard.value) {
        if (!p1Cards.includes(position)) {
          let player = position.slice(0, 2);
          let playerCards = { ...this.state[player] };
          fetch(
            `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${card.code}`
          );
          this.setState(prevState => ({
            secondCard: true,
            cards: Object.assign(prevState.cards, { [position]: null }),
            topDiscard: card,
            selectedCardA: null,
            [player]: Object.assign(prevState[player], {
              [position]: { front: false }
            }),
            swipedCard: position,
            power: "swipedCard"
          }));
          alert("Select which card you want to replaced it with!");
        } else {
          fetch(
            `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${card.code}`
          );
          this.setState(prevState => ({
            secondCard: true,
            cards: Object.assign(prevState.cards, { [position]: null }),
            topDiscard: card,
            selectedCardA: null
          }));
        }
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

  swipedCard = (card, position) => {
    console.log("in swiped card");
    let player = position.slice(0, 2);
    this.setState(prevState => ({
      cards: Object.assign(prevState.cards, {
        [prevState.swipedCard]: card,
        [position]: null
      }),
      [player]: Object.assign(prevState[player], { [position]: null }),
      power: null,
      swipedCard: null
    }));
  };

  lookSelf = (event, card, position) => {
    console.log("in look self");
    let p1Cards = ["p1a", "p1b", "p1c", "p1d"];
    if (p1Cards.includes(position) & !this.state.selectedCardA) {
      event.target.className = "Selected";
      Promise.resolve(
        this.setState(prevState => ({
          selectedCardA: { [position]: card },
          cards: Object.assign(prevState.cards, {
            [position]: { ...card, front: true }
          })
        }))
      ).then(() => {
        event.persist();
        setTimeout(() => {
          Array.from(document.querySelectorAll(".Selected")).map(
            item => (item.className = "Not")
          );
          this.setState(prevState => ({
            selectedCardA: null,
            power: null,
            currentTurn: this.state.currentTurn + 1,
            cards: Object.assign(prevState.cards, {
              [position]: { ...card, front: false }
            })
          }));
        }, 1000);
      });
    }
  };

  lookOther = (event, card, position) => {
    console.log("in look other");

    let p1Cards = ["p1a", "p1b", "p1c", "p1d"];
    if (!p1Cards.includes(position) && !this.state.selectedCardA) {
      console.log("clicked");
      event.target.className = "Selected";
      Promise.resolve(
        this.setState(prevState => ({
          selectedCardA: { [position]: card },
          cards: Object.assign(prevState.cards, {
            [position]: { ...card, front: true }
          })
        }))
      ).then(() => {
        setTimeout(() => {
          Array.from(document.querySelectorAll(".Selected")).map(
            item => (item.className = "Not")
          );
          this.setState(prevState => ({
            selectedCardA: null,
            power: null,
            currentTurn: this.state.currentTurn + 1,
            cards: Object.assign(prevState.cards, {
              [position]: { ...prevState.cards[position], front: false }
            })
          }));
        }, 1000);
      });
    }
  };

  discardCard = (event, card) => {
    let turn = this.state.currentTurn + 1;
    if (turn === 5) {
      turn = 1;
    }
    if (this.state.deckCard && this.state.currentTurn === 1) {
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
        this.setState({ power: null, currentTurn: turn });
      }

      this.setState(prevState => ({
        secondCard: false,
        prevDeckCard: prevState.deckCard,
        topDiscard: prevState.deckCard,
        selectedCardA: null,
        playedCard: prevState.deckCard,
        deckCard: null
      }));
    } else if (!this.state.deckCard && this.state.currentTurn === 1) {
      event.target.className = "Selected";
      console.log("selected discard");

      Promise.all([
        fetch(
          `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/draw/?cards=${card.code}`
        ),
        this.setState({ selectedCardA: card, power: "discardTrade" })
      ]).then(() => {
        alert("Select one of your cards to trade with discarded card.");
        console.log(this.selectedCardA);
      });
    }
  };

  discardTrade = (card, position) => {
    let p1Cards = ["p1a", "p1b", "p1c", "p1d"];
    console.log("in discardtrade");
    console.log("selected card", card);
    console.log(position);
    if (p1Cards.includes(position)) {
      console.log("selecting a card");
      console.log(this.state.selectedCardA);
      fetch(
        `https://deckofcardsapi.com/api/deck/${this.state.deck_id}/pile/discard/add/?cards=${card.code}`
      ).then(() => console.log("adding new card to discard"));
      Promise.resolve(
        this.setState(prevState => ({
          cards: Object.assign(prevState.cards, {
            [position]: prevState.selectedCardA
          }),
          topDiscard: card,
          currentTurn: 2,
          power: null,
          selectedCardA: null
        }))
      ).then(() => {
        Array.from(document.querySelectorAll(".Selected")).map(
          card => (card.className = "Not")
        );
      });
    }
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
          discardTrade={this.discardTrade}
          cardBack={cardBack}
          position={key}
          joker={joker}
          swipedCard={this.swipedCard}
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
        this.setState({ playing: true, currentTurn: 1 });
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
          newObj[key] = { ...json.cards[i], front: false };
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

  callCambio = () => {
    this.setState({
      p1: { last: true },
      currentTurn: 2,
      cambio: true,
      cambioCaller: "p1"
    });
    alert("Player 1 calls cambio");
  };

  skipTurn = () => {
    this.setState({ currentTurn: 2 });
  };

  showCards = () => {
    let showCards = {
      p1a: { ...this.state.cards.p1a, front: true },
      p1b: { ...this.state.cards.p1b, front: true }
    };
    this.setState(prevState => ({
      cards: Object.assign(prevState.cards, showCards)
    }));
  };

  hideCards = () => {
    let hideCards = {
      p1a: { ...this.state.cards.p1a, front: false },
      p1b: { ...this.state.cards.p1b, front: false }
    };
    this.setState(prevState => ({
      cards: Object.assign(prevState.cards, hideCards),
      firstTime: false
    }));
  };
  rules = () => {
    const handleClose = () => this.setState({ rules: false });
    // const handleShow = () => this.setState({ rules: true });

    return (
      <>
        <Modal
          show={this.state.rules}
          onHide={handleClose}
          animation={true}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Welcome to Cambio!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              <li>The object of the game is to get the fewest points.</li>
              <li>
                Jokers are worth -1 points. Ace is worth 1 point. Red kings are
                worth zero points. Other face cards are worth 10. And all other
                cards are face value.
              </li>
              <li>
                Memorize Your first two cards and their positions before you
                draw.
              </li>
              <li>
                You are player one. Draw one card from the deck when Player 1 is
                red.
              </li>
              <li>
                Decide where you want to put the card. Either replace one card
                in your hand or discard it onto the discard pile.
              </li>
              <li>
                You can draw from the discard pile and replace a card in your
                hand.
              </li>
              <li>
                You can a play card of matching value to the discarded card as
                long as one hasn't been played on top of it already.
                <li>
                  You can play another player's card and then you must give them
                  one of yours.
                </li>
              </li>
              <li>
                If you draw a card that is 7 or higher (except red king) there
                is a power. [IMPORTANT]{" "}
                <b>Only if you play it on the discard pile.</b>
              </li>
              <u>Powers</u>
              <ul>
                <li>7 or 8, look at self.</li>
                <li>9 or 10, look at another player's card.</li>
                <li>
                  Jack or Queen, swap two cards on the field without looking at
                  them.
                </li>
                <li>
                  Black king, look at another player's card and swap it with any
                  other card.
                </li>
              </ul>
              <li>
                Once you play a card with a power you must use the power before
                the game proceeds.
              </li>
            </ul>
            <div style={{ height: "200%", width: "200%" }}>
              <img src={cambio} />{" "}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  render() {
    return (
      <>
        <div className="app">
          {(this.state.cards.p1a ||
            this.state.cards.p1b ||
            this.state.cards.p1c ||
            this.state.cards.p1d) &&
          this.state.currentTurn === 1 &&
          !this.state.deckCard &&
          !this.state.cambio &&
          this.countPoints({
            p1a: this.state.cards.p1a,
            p1b: this.state.cards.p1b,
            p1c: this.state.cards.p1c,
            p1d: this.state.cards.p1d
          }) < 5 ? (
            <button class="btn btn-info" onClick={() => this.callCambio()}>
              Cambio?
            </button>
          ) : null}
          {!this.state.playing ? (
            <div id="intro">
              <h1 id="cambio">Cambio!</h1> <br></br>
              <br></br>
              <div id="play">
                <button class="btn btn-info" onClick={this.play}>
                  Play
                </button>
              </div>
            </div>
          ) : null}

          {this.state.playing ? this.renderCards() : null}
          <TurnLabel
            turn={this.state.currentTurn}
            playing={this.state.playing}
          />

          <Computer
            showCards={this.showCards}
            hideCards={this.hideCards}
            computerPlay={this.computerPlay}
            turn={this.state.currentTurn}
            computer2played={this.state.computer2played}
            computer3played={this.state.computer3played}
            computer4played={this.state.computer4played}
            deckCard={this.state.deckCard}
            resetPlay={this.resetPlay}
            computerHit={this.computerHit}
            secondCard={this.state.secondCard}
            topDiscard={this.state.topDiscard}
            p1Cambio={this.state.p1["last"]}
            gameOver={this.gameOver}
            setLast={this.setLast}
            automaticCambio={this.state.automaticCambio}
            cards={this.state.cards}
            automaticCambioFunction={this.automaticCambio}
            skipTurn={this.skipTurn}
            cambio={this.state.cambio}
            playing={this.state.playing}
            firstTime={this.state.firstTime}
            secondCard={this.state.secondCard}
          />
          {this.state.playing ? (
            <Deck
              cardBack={cardBack}
              playing={this.state.playing}
              deckCard={this.state.deckCard}
              drawDeck={this.drawDeck}
              joker={joker}
              remaining={this.state.remaining}
            />
          ) : null}
          <Discard
            playedCard={this.state.topDiscard}
            discardCard={this.discardCard}
            playing={this.state.playing}
            cardBack={cardBack}
            joker={joker}
          />
        </div>
        {this.rules()}
        {this.state.playing ? (
          <div id="rules">
            <button
              className="btn btn-info"
              onClick={() => {
                this.setState({ rules: true });
              }}
            >
              Rules
            </button>
          </div>
        ) : null}
      </>
    );
  }
}
export default App;
