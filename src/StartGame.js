import React from 'react'
import {Participate} from './Participate.tsx'

class StartGame extends React.Component {
		
	constructor() {
	  super()
	  this.state = {
        participateCards:[],
        delearCards:[],
        standing: false,
        bet_amount: 0,
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

    onBetHandler = (id) => {
        console.log("snadler!!!")
        console.log(id)
        console.log(this.state.bet_amount)
        this.setState({bet_amount: this.state.bet_amount + id})
    }

    // TODO (tomert)- Add a trash talk string (choosing a random TT string from a list)
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
                        <div className='chips_layout'>
                            <div className='chips'>
                                    <button className='chip-button red' onClick={()=>this.onBetHandler(1)}> 1 </button>
                                    <button className='chip-button orange' onClick={()=>this.onBetHandler(5)}> 5 </button>
                                    <button className='chip-button green' onClick={()=>this.onBetHandler(10)}> 10 </button>
                                    <button className='chip-button blue' onClick={()=>this.onBetHandler(25)}> 25 </button>
                                    <button className='chip-button black' onClick={()=>this.onBetHandler(100)}> 100 </button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>);
    }
		
}

export {StartGame};