import React from "react"

export default class Deck extends React.Component{
    render(){
        
        return (<div  className="deck"><img onClick={this.props.playing ? ()=> this.props.drawDeck(): null} src={ this.props.currentCard && this.props.currentCard.value !== "JOKER" ? this.props.currentCard.image : this.props.currentCard && this.props.currentCard.value === "JOKER" ? this.props.joker : this.props.cardBack}/></div>)
    }
}