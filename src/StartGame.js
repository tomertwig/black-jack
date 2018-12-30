import React from 'react'
import {Participate} from './Participate.jsx'

var RoundStage = Object.freeze({Betting:1, DealingCards:2, Double:3 ,HitOrStand:4, Standing:5, RoundEnded:6})       
var RoundResult = Object.freeze({None:1, ParticipateWon:2, DealerWon:3, Duce:4 })       

class StartGame extends React.Component {

	constructor() {
	  super()
	  this.state = {
        participateCards:[],
        delearCards:[],
        roundInfo : {stage: RoundStage.Betting, result: RoundResult.none},
        totalChips: 200,
        potChips: [],
      }
	}

    getTotalPotChips(){
        let totalPotChips = 0;
        for (let i =0; i < this.state.potChips.length; i++){
            totalPotChips += (this.state.potChips[i].chipID*this.state.potChips[i].count); 
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
        let potChips = []
        let participateCards = [];
        let delearCards = [];
        this.state.roundInfo.stage = RoundStage.Betting;
        this.state.roundInfo.result = RoundResult.none
        this.setState({participateCards:participateCards, delearCards:delearCards, potChips});
    }

    getCard = (participateCards, participateCardsStateName) =>{
        participateCards.push(this.getReandomCard())
        this.setState({participateCardsStateName:participateCards});
    }

    onFinishBetting = () =>{        
        if (this.state.potChips.length > 0)
        {
            this.state.roundInfo.stage = RoundStage.DealingCards;
            this.setState({roundInfo:this.state.roundInfo});
            setTimeout(() => { this.getCard(this.state.participateCards, 'participateCards')}, 800)
            setTimeout(() => { this.getCard(this.state.delearCards, 'delearCards')}, 1800)
            setTimeout(() => { this.getCard(this.state.participateCards, 'participateCards')}, 2500)
            setTimeout(this.moveToHitOrStandStage, 2600)
        }
    }

    isParticipateHasBlackJack(){
        let participateCards = this.state.participateCards
        let delearCards = this.state.delearCards
        return participateCards.length ===2 && this.getMaxSum(participateCards) === 21 && this.getMaxSum(delearCards) < 21;
    }

    getCardValue(card)
    {   
        let cardValue;
        if (card.rank === 1){
            cardValue = 1
        } 
        else if (card.rank > 10)
        {
            cardValue = 10
        } 
        else{
            cardValue = card.rank;
        } 
        return cardValue;
    }
    
    doubleAllowed(){
        let cardsSum = this.getMaxSum(this.state.participateCards);
        let totalChips = this.state.totalChips;
        return (cardsSum <= 11 && cardsSum >=9) && totalChips >= this.getTotalPotChips();
    }
    
    moveToHitOrStandStage = () =>{
        let roundInfo = this.state.roundInfo

        if (this.isParticipateHasBlackJack())
        {
            roundInfo.result = RoundResult.ParticipateWon;
            this.onRoundHasWinner(roundInfo.result)
            this.setState({roundInfo});
        } else{
            if (this.doubleAllowed()){
                roundInfo.stage = RoundStage.Double;
            }
            else{
                roundInfo.stage = RoundStage.HitOrStand;
            }  
            
            this.setState({roundInfo});
        }
    }

	onHitHandler = () => {
        if (this.state.roundInfo.stage != RoundStage.HitOrStand && this.state.roundInfo.stage != RoundStage.Double)
        {
            return;
        }
        let participateCards = this.state.participateCards
        participateCards.push(this.getReandomCard())
        this.setState({participateCards: participateCards})
        
        let maxSum = this.getMaxSum(participateCards)
        if (maxSum > 21 ){
            let roundInfo = this.state.roundInfo
            roundInfo.stage = RoundStage.RoundEnded;
            roundInfo.result = RoundResult.DealerWon;
            this.setState({roundInfo});
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
                if (bigSum > 21){
                    bigSum -=10;
                }
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

    pullDealerCards = () => {
        let delearCards = this.state.delearCards

        delearCards.push(this.getReandomCard())

        let maxDelearSum = this.getMaxSum(delearCards);
        let maxParticipateSum = this.getMaxSum(this.state.participateCards);

        let roundResult = RoundResult.none;
        if (maxDelearSum > 16){
            if (maxDelearSum > 21)
            {
                roundResult = RoundResult.ParticipateWon;
            }
            else
            {
                if (maxDelearSum > 16)
                {
                    if (maxParticipateSum > maxDelearSum)
                    {
                        roundResult = RoundResult.ParticipateWon;
                    }
                    else{
                        if (maxParticipateSum === maxDelearSum)
                        {
                            roundResult = RoundResult.Duce;
                        }
                        else{
                            roundResult = RoundResult.DealerWon;
                        }
                    }
                }
            }
        }
        this.setState({delearCards:delearCards})

        if (roundResult === RoundResult.none)
        {
            setTimeout(this.pullDealerCards, 1000)
        }
        else{
            this.onRoundHasWinner(roundResult)
        }

    }

    onRoundHasWinner(roundResult)
    {
        let totalChips = this.state.totalChips

        switch(roundResult) {
            case RoundResult.ParticipateWon:
                let profit;
                if (this.isParticipateHasBlackJack())
                {
                    profit = Math.floor(this.getTotalPotChips() * 2.5 + 1);
                } else
                {
                    profit = this.getTotalPotChips() * 2;
                }
                totalChips += profit;
                break;
            case RoundResult.Duce:
                totalChips += this.getTotalPotChips()
                break;
        }
        
        setTimeout(() => {
            this.state.roundInfo.stage = RoundStage.RoundEnded;
            this.state.roundInfo.result = roundResult;
            this.setState({totalChips:totalChips})}, 1000);
    }
    
    onDoubleHandler = () => {
        if (this.state.roundInfo.stage != RoundStage.Double)
        {
            return;
        }
        let potChips = [];
        for (var i = 0; i < this.state.potChips.length; i++)
        {
            for (var j = 0; j < this.state.potChips[i].count; j++)
            {
                potChips.push({chipID: this.state.potChips[i].chipID, count:this.state.potChips[i].count});
            }
        }
        
        for (var i = 0; i < potChips.length; i++)
        {
            for (var j = 0; j < potChips[i].count; j++)
            {
                console.log(potChips[i].chipID)
                this.onBetHandler(potChips[i].chipID);
            }
        }
        
        this.onHitHandler()
        this.onStandHandler()
    }

    onStandHandler = () => {
        if (this.state.roundInfo.stage != RoundStage.HitOrStand && this.state.roundInfo.stage != RoundStage.Double)
        {
            return;
        }

        let roundInfo  = this.state.roundInfo
        roundInfo.stage = RoundStage.Standing;
        this.setState({roundInfo})
        setTimeout(this.pullDealerCards, 1000)
    }

    onRemoveBetHandler = (chipID) => {
        if (this.state.roundInfo.stage != RoundStage.Betting)
        {
            return;
        }

        for (var i = 0; i < this.state.potChips.length; i++)
        {
            if (this.state.potChips[i].chipID == chipID)
            {
                this.state.potChips[i].count -= 1;
                break;
            }
        }

        let potChips = [];
        for (var i = 0; i < this.state.potChips.length; i++)
        {
            if (this.state.potChips[i].count > 0)
            {
                potChips.push(this.state.potChips[i]);
            }
        }

        this.state.potChips = potChips;

        let totalChips = this.state.totalChips + chipID;
        this.setState({totalChips})
    }

    onBetHandler = (chipID) => {
        if (this.state.roundInfo.stage != RoundStage.Betting && this.state.roundInfo.stage != RoundStage.Double)
        {
            return;
        }
        if (this.state.totalChips >= chipID)
        {   
            var i = 0;
            for (; i < this.state.potChips.length; i++)
            {
                if (this.state.potChips[i].chipID == chipID)
                {
                    console.log(chipID)

                    this.state.potChips[i].count += 1;
                    break;
                }
            }
            if (i === this.state.potChips.length)
            {
                this.state.potChips.push({chipID: chipID, count:1});
            }

            let totalChips = this.state.totalChips - chipID;
            this.setState({totalChips})
        }
    }

    renderPlayerActionsButtons(){
        let betButtonClass = 'disabled';
        let hitAndStandButtonsClass = 'disabled';
        let doubleButtonClass = 'disabled';

        if (this.state.roundInfo.stage === RoundStage.Betting &&  (this.getTotalPotChips() > 0))
        {
            betButtonClass = ''             
        }
        
        if (this.state.roundInfo.stage != RoundStage.RoundEnded && this.state.roundInfo.stage != RoundStage.Betting){
            
            if (this.state.roundInfo.stage != RoundStage.Standing &&
                this.state.roundInfo.stage != RoundStage.DealingCards){
                    hitAndStandButtonsClass = '';
                }

            if (this.state.roundInfo.stage == RoundStage.Double){
                doubleButtonClass = '';
            } 

        }
        
        return (
            <div className='player-actions'>
                <button className='hit-stand-buttons_layout' disabled={betButtonClass}  onClick={this.onFinishBetting}>Bet</button>    
                <button className='hit-stand-buttons_layout' disabled={hitAndStandButtonsClass} onClick={this.onHitHandler}> Hit </button>
                <button className='hit-stand-buttons_layout' disabled={hitAndStandButtonsClass} onClick={this.onStandHandler}> Stand </button> 
                <button className='hit-stand-buttons_layout' disabled={doubleButtonClass} onClick={this.onDoubleHandler}> Double </button> 
            </div>)
    }

    renderBetSameChip(chipInfo){
        let betChips = [];

        for (var i = 0; i < chipInfo.count; i++)
        {   
            let colorName;
            switch (chipInfo.chipID){
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
                            <button className={colorName} key={i} onClick={()=>this.onRemoveBetHandler(chipInfo.chipID)}> </button>
                         </div>)
        }
        return betChips
    }

    renderBetChips(){
        let betChips = [];

        for (var i = 0; i < this.state.potChips.length; i++) {
            var chipInfo = this.state.potChips[i];
            if (chipInfo.count > 0)
            {
                betChips.push(<div className={'same-chip'} key={i}> {this.renderBetSameChip(chipInfo)} </div>)
            }
        }
        return betChips
    }
    renderChips(){
        const isBettingStage = this.state.roundInfo.stage === RoundStage.Betting;
        let black_chip = isBettingStage && this.state.totalChips >= 100 ? 'chip-button black-chip' : 'chip-button black-chip disabled';
        let blue_chip = isBettingStage && this.state.totalChips >= 25 ? 'chip-button blue-chip' : 'chip-button blue-chip disabled';
        let purple_chip = isBettingStage && this.state.totalChips >= 10 ? 'chip-button purple-chip' : 'chip-button purple-chip disabled';
        let orange_chip = isBettingStage && this.state.totalChips >= 5 ? 'chip-button orange-chip' : 'chip-button orange-chip disabled';
        let red_chip = isBettingStage && this.state.totalChips >= 1 ? 'chip-button red-chip' : 'chip-button red-chip disabled';
        return (
            <div className='chips_layout'>
                <div className='chips'>
                    <button className={red_chip} onClick={()=>this.onBetHandler(1)}> 1 </button>
                    <button className={orange_chip} onClick={()=>this.onBetHandler(5)}> 5 </button>
                    <button className={purple_chip} onClick={()=>this.onBetHandler(10)}> 10 </button>
                    <button className={blue_chip} onClick={()=>this.onBetHandler(25)}> 25 </button>
                    <button className={black_chip}  onClick={()=>this.onBetHandler(100)}> 100 </button>
                </div>
                <span className="tooltiptext">Total Chips: {this.state.totalChips}</span>
            </div>
        )
    }

    getPotClassName(){
        let potClassName = 'chips_pot ';
        if (this.state.roundInfo.result === RoundResult.DealerWon){
            potClassName += 'lost_chips_pot';
        }
        else if (this.state.roundInfo.result === RoundResult.ParticipateWon)
        {
            potClassName += 'participate_won';
        }
        return potClassName;
    }

    renderPotChips(){
        let chipsPot = [];

        if (this.state.roundInfo.result === RoundResult.ParticipateWon)
        {
            chipsPot.push(<div className= 'delear_chips_pot'> {this.renderBetChips()}</div>)
        }
        chipsPot.push(<div className={this.getPotClassName()}> {this.renderBetChips()}
                         <span className="tooltiptext">Current Bet: {this.getTotalPotChips()}</span>
                     </div>)
        return chipsPot;
    }


    // TODO (tomert)- Add a trash talk string (choosing a random TT string from a list)
	render(){
        if  (this.state.roundInfo.stage === RoundStage.RoundEnded)
        {
            setTimeout(this.startBetting, 2000)
        }

        return (
        <div className='container'>
                <div className='dealer_table'>
                    <Participate cards={this.state.delearCards} showCards={this.state.roundInfo.stage != RoundStage.RoundEnded} />
                    <Participate cards={this.state.participateCards} showCards={this.state.roundInfo.stage != RoundStage.RoundEnded} />
                </div>
                {this.renderChips()}
                {this.renderPotChips()}
                <div> {this.renderPlayerActionsButtons()} </div>
                <img className='keys-img' src='keys.png' />
        </div>);
    }		
}

export {StartGame};