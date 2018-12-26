import React from 'react'
import {StartGame} from './StartGame';
import style from './App.css'

class AppCls extends React.Component {
		
	constructor() {
	  super()
	  this.state = {
			isGameStarted : false,
	  }
	}

	onClickHandler = (e) => {
		this.setState({'isGameStarted':true})
	}
	render(){
				if (!this.state.isGameStarted)
				{
					return (<div className='container blackjack_logo'>
						<button className='start-game-button' onClick={this.onClickHandler}>
							Start Game 
						</button>
						</div>); 	
				} 
				else{
					return <StartGame/>
				}
		}
}

export {AppCls};