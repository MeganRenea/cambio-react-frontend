import React from "react"

export default class Card extends React.Component{

    powerfulCards = ["QUEEN", "JACK", "KS", "KC", 8, 7, 9, 10]
    blindSwap = ["QUEEN", "JACK"]
    lookSwap = ["KS", "KC"]
    lookSelf = [8, 7]
    lookOther = [9,10]
    sameCard =  () => this.props.playedCard && (this.props.playedCard === this.props.prevdeckCard)

    render(){
        
    return (<div id={this.props.position} >{this.props.card ? <img onClick={!this.props.power ? (e) => this.props.regularPlay(e, this.props.card, this.props.position) : this.props.power === "blindSwap" ? (e) => this.props.blindSwap(e, this.props.card, this.props.position) :  this.props.power === "lookSwap" ? (e)=> this.props.lookSwap(e, this.props.card, this.props.position) : this.props.power === "lookOther" ? (e) => this.props.lookOther(e, this.props.card, this.props.position) : (e) => this.props.lookSelf(e, this.props.card, this.props.position)} src={ (this.props.card.image.includes("joker")) || this.props.card.value === "JOKER" ? this.props.joker: this.props.card.image}/> : null}</div>)
    }
}