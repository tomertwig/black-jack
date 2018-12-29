import React from 'react'
import './card.css'


class Card extends React.Component{
	constructor(rank, suite) {
        super()
        this.props = {rank, suite}
      }

	render(){
            let color;
            switch(this.props.suite) {
                case '♠':
                    color = 'black'
                    break;
                case '♥':
                    color = 'red'
                    break;
                case '♣':
                    color = 'black'
                    break;
                case '♦':
                    color = 'red'
                    break;
            }
            let rank;
            switch(this.props.rank) {
                case 11:
                    rank = 'J'
                    break;
                case 12:
                    rank = 'Q'
                    break;
                case 13:
                    rank = 'K'
                    break;
                case 1:
                    rank = 'A'
                    break;
                default:
                    rank = this.props.rank
            }

            let number = 'number ' +  color
            let suite = 'suite ' +  color

            return <div className='card_border'> 
                <span className={number} > {rank}</span>
                <span className={suite}> {this.props.suite} </span>
            </div> 
		}
}

export {Card};