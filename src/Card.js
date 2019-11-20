import React from "react"

export default class Card extends React.Component{

  
    render(){
        
        return (<div className={this.props.position}><img  src={ (this.props.image && this.props.image.includes("joker")) || this.props.value === "JOKER" ? this.props.joker: this.props.image}/></div>)
    }
}