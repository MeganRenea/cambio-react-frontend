import React from "react"

export default class Discard extends React.Component{
    render(){
        
        return (<div  id="discard" ><img onClick={()=> this.props.discardCard()} src={ this.props.playedCard && this.props.playedCard.value !== "JOKER" ? this.props.playedCard.image : this.props.playedCard && this.props.playedCard.value === "JOKER" ? this.props.joker : this.props.playing ? this.props.cardBack : null }/></div>)
    }
}