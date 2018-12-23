import React from 'react'
import style from './App.css'

class StartGame extends React.Component {
		
	constructor() {
	  super()
	  this.state = {
			cards : [],
	  }
	}

	onHitHandler = (e) => {
        this.state.cards.push(1)
    }
    
	render(){
        return (<div className='container'>
        <img className='dealer_table' src={require('./table.jpeg')} />
        <img className='dealer-button' src={require('./dealer.jpeg')} />
        <button className='hit-button' onClick={this.onHitHandler}> Hit </button>
        <button className='stand-button' onClick={this.onHitHandler}> Stand </button>

        </div>);
    }
		
}

export {StartGame};