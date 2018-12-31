import React from 'react'
import './card.css'
import {Card} from './card.jsx'

class Participate extends React.Component{
	constructor(cards, showCards, isDealer) {
        super()
        this.props = {cards, showCards, isDealer}
      }
    renderCards(){
        let cards = [];

        for (let i =0; i < this.props.cards.length; i++)
        {   
            const className = this.props.isDealer? 'card-to-dealer': 'card-to-participate';
            const cardRendered = (
                    <div className={className}>
                        <Card className="card"  key={i} rank={this.props.cards[i].rank} suite={this.props.cards[i].suite}> </Card>
                    </div>)

            cards.push(cardRendered)
        }
        return cards
    }

    render(){
        let className = this.props.showCards ? 'cards' :  this.props.isDealer? 'card dealer-card-disappear' : 'card participate-card-disappear';

        return <div className={className}> {this.renderCards()} </div>
    }
}

export {Participate};