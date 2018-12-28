import React from 'react'
import {Participate} from './Participate.tsx'

var GameStatus = Object.freeze({betStage:1, dealingCardsStage:2 , hitOrStandStage:3, standingStage:4, roundEndedStage:5})       
var RoundResult = Object.freeze({none:1, participateWon:2, dealerWon:3, duce:4 })       

class StartGame extends React.Component {

	constructor() {
	  super()
	  this.state = {
        participateCards:[],
        delearCards:[],
        gameStatus: GameStatus.betStage,
        totalChips: 200,
        potChips: [],
        roundResult: RoundResult.none,
      }
	}

    getTotalPotChips(){
        let totalPotChips = 0;
        for (let i =0; i < this.state.potChips.length; i++){
            totalPotChips += (this.state.potChips[i][0]*this.state.potChips[i][1]); 
        }
        return totalPotChips;
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
        let roundResult = RoundResult.none;
        let potChips = []
        let participateCards = [];
        let delearCards = [];
        this.setState({participateCards:participateCards, delearCards:delearCards, gameStatus:GameStatus.betStage, potChips, roundResult});
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
        if (this.state.potChips.length > 0)
        {
            this.setState({ gameStatus:GameStatus.dealingCardsStage});
            setTimeout(this.getParticipateCard, 800)
            setTimeout(this.getDealerCard, 1800)
            setTimeout(this.getParticipateCard, 2500)
            setTimeout(this.moveToHitOrStandStage, 2600)
        }
    }

    moveToHitOrStandStage = () =>{
        this.setState({gameStatus:GameStatus.hitOrStandStage});
    }

	onHitHandler = (e) => {
        if (this.state.gameStatus === GameStatus.standingStage)
        {
            return;
        }
        let participateCards = this.state.participateCards
        participateCards.push(this.getReandomCard())
        this.setState({participateCards: participateCards})
        
        let maxSum = this.getMaxSum(participateCards)
        if (maxSum > 21 ){
            let roundResult = RoundResult.dealerWon;

            this.setState({gameStatus: GameStatus.roundEndedStage, roundResult})
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
        let roundResult = RoundResult.none;
        if (maxDelearSum > 16){
            if (maxDelearSum > 21)
            {
                roundResult = RoundResult.participateWon;
            }
            else
            {
                if (maxDelearSum > 16)
                {
                    let maxParticipateSum = this.getMaxSum(this.state.participateCards);
                    if (maxParticipateSum > maxDelearSum)
                    {
                        roundResult = RoundResult.participateWon;
                    }
                    else{
                        if (maxParticipateSum === maxDelearSum)
                        {
                            roundResult = RoundResult.duce;
                        }
                        else{
                            roundResult = RoundResult.dealerWon;
                        }
                    }
                
                }

            }
        }
        
        let totalChips = this.state.totalChips

        this.setState({delearCards:delearCards})

        switch(roundResult) {
            case RoundResult.none:
                setTimeout(this.pullDealerCards, 1000)
                return;
            case RoundResult.participateWon:
                totalChips = totalChips + (this.getTotalPotChips() * 2);
                break;
            case RoundResult.duce:
                totalChips += this.getTotalPotChips()
                break;
        }
        
        setTimeout(() => {
            this.setState({
                gameStatus: GameStatus.roundEndedStage, totalChips:totalChips, roundResult})},
                1000);

    }
	onStandHandler = (e) => {
        if (this.state.gameStatus === GameStatus.standingStage)
        {
            return;
        }

        this.setState({gameStatus: GameStatus.standingStage})
        setTimeout(this.pullDealerCards, 1000)
    }

    onRemoveBetHandler = (id) => {
        if (this.state.gameStatus != GameStatus.betStage)
        {
            return;
        }


        console.log('onRemoveBetHandler')
        console.log(id)

        console.log(this.state.potChips)
        var chipIndex;
        for (var i = 0; i < this.state.potChips.length; i++)
        {
            if (this.state.potChips[i][0] == id)
            {
                console.log('found')
                console.log(i)

                chipIndex = i;
                this.state.potChips[i][1] -= 1;
                break;
            }
        }

        this.state.potChips.filter(function(ele){
            return ele[1] > 0;
        });

        let totalChips = this.state.totalChips + id;
        this.setState({totalChips})
    }

    onBetHandler = (id) => {
        console.log('onBetHandler')
        console.log(this.state.potChips)

        if (this.state.gameStatus != GameStatus.betStage)
        {
            return;
        }
        if (this.state.totalChips >= id)
        {   
            var i = 0;
            for (; i < this.state.potChips.length; i++)
            {
                if (this.state.potChips[i][0] == id)
                {
                    console.log('found')
                    console.log(i)

                    this.state.potChips[i][1] += 1;
                    break;
                }
            }
            if (i === this.state.potChips.length)
            {
                this.state.potChips.push([id,1]);
            }
            console.log(this.state.potChips)

            let totalChips = this.state.totalChips - id;
            this.setState({totalChips})

        }
    }

    renderGameStatelayout(){
        if (this.state.gameStatus === GameStatus.betStage)
        {
            if (this.getTotalPotChips() > 0)
            {
                return  <button className='round-ended' onClick={this.finishBetting}>Bet</button>                     
            }
        }
        else{
            if  (this.state.gameStatus === GameStatus.roundEndedStage)
            {
                setTimeout(this.startBetting, 2000)
            }
            else if (this.state.gameStatus != GameStatus.dealingCardsStage && this.state.gameStatus != GameStatus.standingStage )
            {
                return (
                <div className='buttons_layout'>
                    <button className='round-ended' onClick={this.onHitHandler}> Hit </button>
                    <button className='round-ended' onClick={this.onStandHandler}> Stand </button> 
                </div>)
            }
        }
    }

    renderBetSameChip(chipNumber){
        let betChips = [];
        console.log('renderBetSameChip')
        console.log(chipNumber)

        for (var i = 0; i < chipNumber[1]; i++)
        {   
            let colorName;
            switch (chipNumber[0]){
                case 1:
                    colorName = 'small-chip red-chip'
                    break;
                case 5:
                    colorName = 'small-chip orange-chip'
                    break;
                case 10:
                    colorName = 'small-chip purple-chip'
                    break;
                case 25:
                    colorName = 'small-chip blue-chip'
                    break;
                case 100:
                    colorName = 'small-chip black-chip'
                    break;
            }
            console.log(colorName)
            betChips.push(<div > 
                            <button className={colorName} key={i} onClick={()=>this.onRemoveBetHandler(chipNumber[0])}> </button>
                         </div>)
        }
        return betChips
    }

    renderBetChips(){
        let betChips = [];

        for (var i = 0; i < this.state.potChips.length; i++) {
            var elem = this.state.potChips[i];
            if (elem[1] > 0)
            {
                betChips.push(<div className={'same-chip'} key={i}> {this.renderBetSameChip(elem)} </div>)
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
        console.log('this.state.roundResult')

        console.log(this.state.roundResult)
        return (
        <div className='container'>
                <div className='dealer_table'>
                    <Participate cards={this.state.delearCards} showCards={this.state.gameStatus != GameStatus.roundEndedStage} />
                    <Participate cards={this.state.participateCards} showCards={this.state.gameStatus != GameStatus.roundEndedStage} />
                </div>
                {this.renderChips()}
                {this.state.roundResult === RoundResult.participateWon ?
                 <div className= 'delear_chips_pot'> {this.renderBetChips()}</div> : null
                }
                <div className= {this.state.roundResult != RoundResult.dealerWon ?  'chips_pot' : 'chips_pot lost_chips_pot'}>
                        {this.renderBetChips()}
                </div>
                <div className='game_settings'>
                    {this.renderGameStatelayout()}
                    <div className='bet_amount'>
                                Current Bet: {this.getTotalPotChips()}
                                <div/>
                                Total Chips: {this.state.totalChips}
                    </div>
                </div>
        </div>);
    }
		
}




export {StartGame};