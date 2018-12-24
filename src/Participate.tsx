import React from 'react'
import './card.css'
import {Card} from './card.tsx'

interface ParticipateProps {
    cards: [];
}

class Participate extends React.Component<ParticipateProps, {} > {

    renderCards(){
        let cards = [];
        for (let i =0; i < this.props.cards.length; i++)
        {   
            cards.push(<Card className='card' key={i} rank={this.props.cards[i].rank} suite={this.props.cards[i].suite} />)
        }
        return cards

    }

    render(){
        return <div className='cards'> {this.renderCards()} </div>
    }
}

export {Participate};