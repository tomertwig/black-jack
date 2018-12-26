import React from 'react'
import {Participate} from './Participate.tsx'

var GameStatus = Object.freeze({shouldBet:1, finishedBetting:2, standing:3, roundEnded:4})       

class StartGame extends React.Component {

	constructor() {
	  super()
	  this.state = {
        participateCards:[],
        delearCards:[],
        gameStatus: GameStatus.shouldBet,
        bet_amount: 0,
        totalChips: 200,
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

    startBetting = () =>{
        let participateCards = [];
        let delearCards = [];
        this.setState({participateCards:participateCards, delearCards:delearCards, gameStatus:GameStatus.shouldBet});
    }
    finishBetting = () =>{
        console.log('finishBetting')
        let participateCards = [];
        let delearCards = [];
        participateCards.push(this.getReandomCard())
        delearCards.push(this.getReandomCard())
        participateCards.push(this.getReandomCard())
        console.log(participateCards)
        this.setState({participateCards:participateCards, delearCards:delearCards, gameStatus:GameStatus.finishedBetting});
    }


	onHitHandler = (e) => {
        if (this.state.gameStatus === GameStatus.standing)
        {
            return;
        }
        let participateCards = this.state.participateCards
        participateCards.push(this.getReandomCard())
        this.setState({participateCards: participateCards})
        
        let maxSum = this.getMaxSum(participateCards)
        if (maxSum > 21 ){
            this.setState({gameStatus: GameStatus.roundEnded})
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

        console.log('pullDealerCards')

        delearCards.push(this.getReandomCard())

        let maxDelearSum = this.getMaxSum(delearCards);
        var HasWineer = Object.freeze({"none":1, "participateWon":2, "dealerWon":3, "duce":4 })       
        let hasWineer = HasWineer.none;
        if (maxDelearSum > 16){
            if (maxDelearSum > 21)
            {
                hasWineer = HasWineer.participateWon;
            }
            else
            {
                if (maxDelearSum > 16)
                {
                    let maxParticipateSum = this.getMaxSum(this.state.participateCards);
                    if (maxParticipateSum > maxDelearSum)
                    {
                        hasWineer = HasWineer.participateWon;
                    }
                    else{
                        if (maxParticipateSum === maxDelearSum)
                        {
                            hasWineer = HasWineer.duce;
                        }
                        else{
                            hasWineer = HasWineer.dealerWon;

                        }
                    }
                
                }

            }
        }
        
        let totalChips = this.state.totalChips
        console.log(this.state.bet_amount)

        console.log(hasWineer)
        switch(hasWineer) {
            case HasWineer.none:
                setTimeout(this.pullDealerCards, 700)
                return;
            case HasWineer.participateWon:
                console.log(totalChips)

                totalChips = totalChips + (this.state.bet_amount * 2);
                console.log('dajsoisjdioad')
                console.log(totalChips)

                break;
            case HasWineer.duce:
                totalChips += this.state.bet_amount 
                break;
            }
    
        this.setState({gameStatus: GameStatus.roundEnded, bet_amount:0, delearCards:delearCards, totalChips:totalChips})
    }
	onStandHandler = (e) => {
        if (this.state.gameStatus === GameStatus.standing)
        {
            return;
        }

        this.setState({gameStatus: GameStatus.standing})
        console.log('before loop')

        this.pullDealerCards();

    }

    onBetHandler = (id) => {
        if (this.state.gameStatus != GameStatus.shouldBet)
        {
            return;
        }
        if (this.state.totalChips >= id)
        {
            let bet_amount = this.state.bet_amount + id;
            let totalChips = this.state.totalChips - id;
            this.setState({totalChips, bet_amount})
        }
    }

    renderGameStatelayout(){
        if (this.state.gameStatus === GameStatus.shouldBet)
        {
            return  <button className='round-ended' onClick={this.finishBetting}>Bet</button>                     
        }
        else{
            if  (this.state.gameStatus === GameStatus.roundEnded)
            {
                return  <button className='round-ended' onClick={this.startBetting}> Start new round </button>                     
            }
            else
            {
                return (
                <div className='buttons_layout'>
                    <button className='round-ended' onClick={this.onHitHandler}> Hit </button>
                    <button className='round-ended' onClick={this.onStandHandler}> Stand </button> 
                </div>)
            }
        }
    }

    renderChips(){
        let black_chip = this.state.totalChips >= 100 ? 'chip-button black' : 'chip-button black disabled';
        let blue_chip = this.state.totalChips >= 25 ? 'chip-button blue' : 'chip-button blue disabled';
        let purple_chip = this.state.totalChips >= 10 ? 'chip-button purple' : 'chip-button purple disabled';
        let orange_chip = this.state.totalChips >= 5 ? 'chip-button orange' : 'chip-button orange disabled';
        let red_chip = this.state.totalChips >= 1 ? 'chip-button red' : 'chip-button red disabled';
        return (
            <div className='chips_layout'>
                <div className='chips'>
                    <button className={red_chip} onClick={()=>this.onBetHandler(1)}> 1 </button>
                    <button className={orange_chip} onClick={()=>this.onBetHandler(5)}> 5 </button>
                    <button className={purple_chip} onClick={()=>this.onBetHandler(10)}> 10 </button>
                    <button className={blue_chip} onClick={()=>this.onBetHandler(25)}> 25 </button>
                    <button className={black_chip}  onClick={()=>this.onBetHandler(100)}> 100 </button>
                </div>
            </div>
        )
    }

    // TODO (tomert)- Add a trash talk string (choosing a random TT string from a list)
	render(){
        return (
        <div className='container'>
                <div className='dealer_table'>
                    <Participate cards={this.state.delearCards} />
                    <Participate cards={this.state.participateCards} />
                </div>
                {this.renderChips()}
                <div className='game_settings'>
                    {this.renderGameStatelayout()}
                    <div className='bet_amount'>
                                Current Bet: {this.state.bet_amount} Total Chips: {this.state.totalChips}
                    </div>
                </div>
        </div>);
    }
		
}




export {StartGame};