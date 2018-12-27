import React from 'react'
import {Participate} from './Participate.tsx'

var GameStatus = Object.freeze({shouldBet:1, dealingCards:2 , finishedBetting:3, standing:4, roundEnded:5})       
var HasWineer = Object.freeze({none:1, participateWon:2, dealerWon:3, duce:4 })       

class StartGame extends React.Component {

	constructor() {
	  super()
	  this.state = {
        participateCards:[],
        delearCards:[],
        gameStatus: GameStatus.shouldBet,
        bet_amount: 0,
        totalChips: 200,
        chips: {1:0, 5:0, 10:0, 25:0, 100:0},
        hasWineer: HasWineer.none,
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
        let hasWineer =  GameStatus.none;
        let chips = {1:0, 5:0, 10:0, 25:0, 100:0}
        let participateCards = [];
        let delearCards = [];
        this.setState({participateCards:participateCards, delearCards:delearCards, gameStatus:GameStatus.shouldBet, chips, hasWineer});
    }
    getParticipateCard = () =>{
        let participateCards = this.state.participateCards;
        participateCards.push(this.getReandomCard())
        this.setState({participateCards});
    }
    getDealerCard = () =>{
        let delearCards = this.state.delearCards;
        delearCards.push(this.getReandomCard())
        this.setState({delearCards});

    }
    finishBetting = () =>{
        console.log('finishBetting')
        
        this.setState({ gameStatus:GameStatus.dealingCards});
        setTimeout(this.getParticipateCard, 1000)
        setTimeout(this.getDealerCard, 1500)
        setTimeout(this.getParticipateCard, 2000)
        setTimeout(this.finisedBetting, 2100)
    }

    finisedBetting = () =>{
        this.setState({ gameStatus:GameStatus.finishedBetting});
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

                break;
            case HasWineer.duce:
                totalChips += this.state.bet_amount 
                break;
            }
    
        this.setState({gameStatus: GameStatus.roundEnded, bet_amount:0, delearCards:delearCards, totalChips:totalChips, hasWineer})
    }
	onStandHandler = (e) => {
        if (this.state.gameStatus === GameStatus.standing)
        {
            return;
        }

        this.setState({gameStatus: GameStatus.standing})
        this.pullDealerCards();

    }

    onBetHandler = (id) => {
        if (this.state.gameStatus != GameStatus.shouldBet)
        {
            return;
        }
        if (this.state.totalChips >= id)
        {
            this.state.chips[id] += 1;
            let bet_amount = this.state.bet_amount + id;
            let totalChips = this.state.totalChips - id;
            this.setState({totalChips, bet_amount})
        }
    }

    renderGameStatelayout(){
        if (this.state.gameStatus === GameStatus.shouldBet)
        {
            if (this.state.bet_amount > 0)
            {
                return  <button className='round-ended' onClick={this.finishBetting}>Bet</button>                     
            }
        }
        else{
            if  (this.state.gameStatus === GameStatus.roundEnded)
            {
                setTimeout(this.startBetting, 2000)
            }
            else if (this.state.gameStatus != GameStatus.dealingCards)
            {
                return (
                <div className='buttons_layout'>
                    <button className='round-ended' onClick={this.onHitHandler}> Hit </button>
                    <button className='round-ended' onClick={this.onStandHandler}> Stand </button> 
                </div>)
            }
        }
    }

    
    renderBetChips(){
        let betChips = [];
        for (var key in this.state.chips) {
            console.log('key')

            console.log(key)
            for (var i = 0; i < this.state.chips[key]; i++)
            {   
                let colorName;
                switch (key){
                    case '1':
                        colorName = 'small-chip red-chip'
                        break;
                    case '5':
                        colorName = 'small-chip orange-chip'
                        break;
                    case '10':
                        colorName = 'small-chip purple-chip'
                        break;
                    case '25':
                        colorName = 'small-chip blue-chip'
                        break;
                    case '100':
                        colorName = 'small-chip black-chip'
                        break;
                }
                betChips.push(<div className={colorName} key={i}> </div>)
            }
        }
        return betChips
    }
    renderChips(){
        let black_chip = this.state.totalChips >= 100 ? 'chip-button black-chip' : 'chip-button black-chip disabled';
        let blue_chip = this.state.totalChips >= 25 ? 'chip-button blue-chip' : 'chip-button blue-chip disabled';
        let purple_chip = this.state.totalChips >= 10 ? 'chip-button purple-chip' : 'chip-button purple-chip disabled';
        let orange_chip = this.state.totalChips >= 5 ? 'chip-button orange-chip' : 'chip-button orange-chip disabled';
        let red_chip = this.state.totalChips >= 1 ? 'chip-button red-chip' : 'chip-button red-chip disabled';
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
        console.log('this.state.hasWineer')

        console.log(this.state.hasWineer)
        console.log('this.state.gameStatus')
        console.log(this.state.gameStatus)

        return (
        <div className='container'>
                <div className='dealer_table'>
                    <Participate cards={this.state.delearCards} showCards={this.state.gameStatus != GameStatus.roundEnded} />
                    <Participate cards={this.state.participateCards} showCards={this.state.gameStatus != GameStatus.roundEnded} />
                </div>
                {this.renderChips()}
                {this.state.hasWineer === HasWineer.participateWon ?
                 <div className= 'delear_chips_pot'> {this.renderBetChips()}</div> : null
                }
                <div className= {this.state.hasWineer != HasWineer.dealerWon ?  'chips_pot' : 'chips_pot lost_chips_pot'}>
                        {this.renderBetChips()}
                </div>
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