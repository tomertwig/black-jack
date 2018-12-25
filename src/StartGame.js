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
        let rank = Math.floor((Math.random() * 13) + 1);
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
        cards.push(card)
        let sum = 0;
        for (let i =0; i < cards.length; i++){
            if (cards[i].rank === 1 || cards[i].rank > 10){
                sum +=10;

            }
            else{
                sum += cards[i].rank;

            }
            console.log(sum)

        }

        this.setState({cards});
        if (sum > 21){
            console.log('GAME OVER')
        }
    }
    
	render(){
        return (
        <div className='container'>
                <img className='dealer-button' src={require('./dealer.jpeg')} />
                <div className='dealer_table'>
                    <div className='space'></div>
                    <div className='space'></div>
                    <div className='participate_layout'>
                        <div className='buttons_layout'>
                        <button className='hit-button' onClick={this.onHitHandler}> Hit </button>
                        <button className='stand-button' onClick={this.onHitHandler}> Stand </button>
                        </div>
                    </div>
                </div>
                <Participate cards={this.state.cards} />
        </div>);
    }
		
}

export {StartGame};