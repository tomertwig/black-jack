import React from 'react'
import {Participate} from './Participate.tsx'

class StartGame extends React.Component {

	constructor() {
	  super()
	  this.state = {
        participateCards:[],
        delearCards:[],
        standing: false,
        roundEnded: true,
        bet_amount: 0,
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

    startNewRound = () =>{
        console.log('startNewRound')
        let participateCards = [];
        let delearCards = [];
        participateCards.push(this.getReandomCard())
        delearCards.push(this.getReandomCard())
        participateCards.push(this.getReandomCard())

        console.log(participateCards)
        this.setState({participateCards:participateCards, delearCards:delearCards, standing:false});
    }

    onStartNewRound = (e) => {
        this.startNewRound();
        this.setState({roundEnded: false});
    }

	onHitHandler = (e) => {
        if (this.state.standing)
        {
            return;
        }
        let participateCards = this.state.participateCards
        participateCards.push(this.getReandomCard())
        this.setState({participateCards: participateCards})
        
        let maxSum = this.getMaxSum(participateCards)
        if (maxSum > 21 ){
            this.setState({roundEnded:true})
        }
    }

    getMaxSum(cards)
    {
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
        }

        if (bigSum > 21)
        {
            return smallSum;
        }else{
            return bigSum;
        }
        

    }

    hit(cards){
        let card = this.getReandomCard()
        cards.push(card);
        let sums = this.getSums(cards)
        let smallSum = sums[0];     
        let bigSum = sums[1];
        return [cards, smallSum, bigSum]
    }

    pullDealerCards = () => {
        let delearCards = this.state.delearCards


        delearCards.push(this.getReandomCard())

        let maxDelearSum = this.getMaxSum(delearCards);
        var GameStatus = Object.freeze({"none":1, "participateWon":2, "dealerWon":3, "duce":4 })       
        let gameStatus = GameStatus.none;
        if (maxDelearSum > 16){
            if (maxDelearSum > 21)
            {
                gameStatus = GameStatus.participateWon;
            }
            else
            {
                if (maxDelearSum > 16)
                {
                    let maxParticipateSum = this.getMaxSum(this.state.participateCards);
                    if (maxParticipateSum > maxDelearSum)
                    {
                        gameStatus = GameStatus.participateWon;
                    }
                    else{
                        if (maxParticipateSum == maxDelearSum)
                        {
                            gameStatus = GameStatus.duce;
                        }
                        else{
                            gameStatus = GameStatus.dealerWon;

                        }
                    }
                
                }

            }
        }
        this.setState(delearCards)
        
        if (gameStatus === GameStatus.none)
        {
            setTimeout(this.pullDealerCards, 700)
        }
        else{
            this.setState({roundEnded:true})
        }
    }
	onStandHandler = (e) => {
        if (this.state.standing)
        {
            return;
        }

        this.setState({standing: true})
        console.log('before loop')

        this.pullDealerCards();

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
                    <Participate cards={this.state.participateCards} />
                    <div className='participate_layout'>
                        {this.state.roundEnded?
                             <button className='round-ended' onClick={this.onStartNewRound}> Start new round </button> :                             
                             <div className='buttons_layout'>
                                <button className='hit-button' onClick={this.onHitHandler}> Hit </button>
                                <button className='stand-button' onClick={this.onStandHandler}> Stand </button> 
                             </div>}
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