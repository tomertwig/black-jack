import React from 'react'
import './card.css'

interface CardProps {
    suite: number;
    rank: number;
}

class Card extends React.Component<CardProps, {}> {

	render(){
            console.log(this.props.suite)
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
            
            let number = 'number ' +  color
            let suite = 'suite ' +  color

            return <div className='card_border'> 
                <span className={number} > {this.props.rank}</span>
                <span className={suite}> {this.props.suite} </span>
            </div> 
		}
}

export {Card};