import React from 'react'
import './card.css'
import {Card} from './card.tsx'

interface ParticipateProps {
    cards: [];
    showCards:boolean;
}

class Participate extends React.Component<ParticipateProps, {} > {
	constructor(cards, showCards) {
        super()
        this.props = {cards, showCards}
      }
    renderCards(){
        let cards = [];

        for (let i =0; i < this.props.cards.length; i++)
        {   
            cards.push(<Card className='card' key={i} rank={this.props.cards[i].rank} suite={this.props.cards[i].suite} />)
        }
        return cards
    }

    render(){
        let className= this.props.showCards ? 'cards' : 'card card-disappear';

        return <div className={className}> {this.renderCards()} </div>
    }
}

export {Participate};