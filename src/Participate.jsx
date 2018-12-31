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
            const className = this.props.isDealer? 'tomer-to-dealer': 'tomer-to-participate';
            const cardRendered = (
                <div className='deck'>
                        <div className={className}>
                            <div className="card__face card__face--front" key={i}></div>
                            <div className="card__face card__face--back" key={i}>
                                <Card className="card"  key={i} rank={this.props.cards[i].rank} suite={this.props.cards[i].suite}> </Card>
                            </div>
                        </div>
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