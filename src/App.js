import React from 'react'
import './app.css'

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
					return (<div className='container'>
						<img src={require('./blackjack.jpg')} />
						<button className='start-game-button' onClick={this.onClickHandler}>
							Start Game 
						</button>
						</div>); 	
				} 
				else{
					return null
				}
		}
}

export {AppCls};