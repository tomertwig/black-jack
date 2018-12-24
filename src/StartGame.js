import React from 'react'
import {Participate} from './Participate.tsx'

class StartGame extends React.Component {
		
	constructor() {
	  super()
	  this.state = {
        cards:[]
	  }
	}

    getReandomCard() {
        let rank = Math.floor((Math.random() * 14) + 1);
        let randomSuit = Math.floor((Math.random() * 4) + 1);
        let suite;
        switch(randomSuit) {
            case 1:
                suite ='♠'
                break;
            case 2:
                suite ='♥'
            break;
            case 3:
                suite ='♣'
                break;
            case 4:
                suite ='♦'
                break;
          }
        return {rank, suite}
    }

	onHitHandler = (e) => {
        let cards = this.state.cards;
        let card = this.getReandomCard()
        console.log(card)
        cards.push(card)
        this.setState({cards});
    }
    
	render(){
        return (<div className='container'>
        <img className='dealer_table' src={require('./table.jpeg')} />
        <img className='dealer-button' src={require('./dealer.jpeg')} />
        <Participate cards={this.state.cards} />
        <button className='hit-button' onClick={this.onHitHandler}> Hit </button>
        <button className='stand-button' onClick={this.onHitHandler}> Stand </button>
        </div>);
    }
		
}

export {StartGame};