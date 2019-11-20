import React from 'react';
import './App.css';
import './index.css'
import Card from "./Card"
import cardBack from "./cardBack.png"
import joker from "./joker.png"
import Deck from "./Deck"

class App extends React.Component {

  state = {
    deck_id: null,
    playing: false,
    cards: {p1a: null,
    p1b:null,
    p1c:null,
    p1d:null,
    p2a:null,
    p2b:null,
    p2c:null,
    p2d:null,
    p3a:null,
    p3b:null,
    p3c:null,
    p3d:null,
    p4a:null,
    p4b:null,
    p4c:null,
    p4d:null},
    points: {
      JOKER: -1,
      ACE: 1,
      QUEEN: 10,
      KING: 10,
      JACK: 10
    },
    p2:{p2a: null,
    p2b: null,
    p2c: null,
    p2d: null},
    p3:{p3a: null,
      p3b: null,
      p3c: null,
      p3d: null},
    p4:{p4a: null,
      p4b: null,
      p4c: null,
      p4d: null},
    currentCard: null,
    currentTurn: 1,
    remaining: null
  }

  drawDeck = () => {
    fetch(`https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=1`).then(resp => resp.json()).then(json => this.setState({currentCard: json.cards[0]}))
  }

  componentDidMount(){
    fetch("https://deckofcardsapi.com/api/deck/new/?jokers_enabled=true", {
    }).then(resp=> resp.json()).then(json=>this.setState({deck_id: json.deck_id, remaining: json.remaining }))
    
  }


   renderCards = () => {
     return Object.keys(this.state.cards).map(key=> {return <Card {...this.state.cards[key]} position={key} joker={joker}/>})
   }

  play = () => {
    fetch(`https://deckofcardsapi.com/api/deck/${this.state.deck_id}/shuffle/?jokers_enabled=true`).then(resp=>resp.json()).then(json => {this.setState({playing: true});this.dealCards()})
    
  }

  dealCards = () => {
    fetch(`https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=16`).then(resp=> resp.json()).then(json => {this.setState({remaining: json.remaining}); 
    let newObj={}; 
    let i = 0
    Object.keys(this.state.cards).forEach(function (key) {
      newObj[key] = json.cards[i];
      i += 1
      return newObj;
    }); let p4= {p4a: newObj.p4a, p4b: newObj.p4b}; let p3 = {p3a: newObj.p3a, p3b: newObj.p3b}; let p2= {p2a: newObj.p2a, p2b : newObj.p2b};
    this.setState(prevState => ({cards: {...newObj}, p2: Object.assign(prevState.p2, p2), p3: Object.assign(prevState.p3, p3), p4: Object.assign(prevState.p4, p4)})); console.log(this.state)})
  }

  
render(){
    return (
      <div className="app">
        {!this.state.playing? <button onClick={this.play}>Play</button>: null}
        {this.renderCards()}
        <Deck cardBack={cardBack} playing={this.state.playing} currentCard={this.state.currentCard} drawDeck={this.drawDeck} joker={joker} remaining={this.state.remaining}/>
        {/* <Discard /> */}
      </div>
    );
  }
}
export default App;
