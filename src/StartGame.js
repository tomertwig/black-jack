import React from 'react'
import {Participate} from './Participate.tsx'

class StartGame extends React.Component {
		
	constructor() {
	  super()
	  this.state = {
        participateCards:[],
        delearCards:[],
        standing: false
      }
      if (this.state.participateCards.length === 0)
      {
          this.hit(this.state.participateCards)
          this.hit(this.state.delearCards)
          this.hit(this.state.participateCards)
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
        if (this.state.standing)
        {
            return;
        }
        let cardsInfo = this.hit(this.state.participateCards);
        this.setState({participateCards: cardsInfo[0]})

    }
    hit(cards){
        let card = this.getReandomCard()
        cards.push(card);      
        let bigSum = 0;
        let smallSum = 0;
        for (let i =0; i < cards.length; i++){
            if (cards[i].rank === 1){
                smallSum += 1
                bigSum += 11
            } 
            else if (cards[i].rank > 10)
            {
                smallSum += 10
                bigSum +=10;
            } 
            else{
                bigSum += cards[i].rank;
                smallSum += cards[i].rank;
            }
            console.log(bigSum)
            console.log(smallSum)
        }

        if (bigSum > 21 && smallSum > 21){
            console.log('GAME OVER')
        }
        return [cards, smallSum, bigSum]
    }

	onStandHandler = (e) => {
        if (this.state.standing)
        {
            return;
        }

        this.setState({standing: true})
        let isParticipateWon;
        while (true)
        {       
            let delearCardsInfo = this.hit(this.state.delearCards)
           
            let smallSum = delearCardsInfo[1]
            let bigSum = delearCardsInfo[2]
            if (bigSum > 16 || smallSum > 16){
                if (bigSum > 21 && smallSum > 21)
                {
                    isParticipateWon = true;
                    break;
                }
                else
                {
                    if (smallSum < 21)
                    {
                        
                    }

                }
            }

            
        }
    }
    
	render(){
       
        return (
        <div className='container'>
                <img className='dealer-button' src={require('./dealer.jpeg')} />
                <div className='dealer_table'>
                    <Participate cards={this.state.delearCards} />
                    <div className='space'></div>
                    <div className='space'></div>
                    <Participate cards={this.state.participateCards} />
                    <div className='participate_layout'>
                        <div className='buttons_layout'>
                        <button className='hit-button' onClick={this.onHitHandler}> Hit </button>
                        <button className='stand-button' onClick={this.onStandHandler}> Stand </button>
                        </div>
                    </div>
                </div>
        </div>);
    }
		
}

export {StartGame};