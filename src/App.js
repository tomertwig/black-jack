import React from 'react'
import './app.css'

class AppCls extends React.Component {
		
	constructor() {
	  super()
	  this.state = {
	  }
	}

	onClickHandler = (e) => {
		console.log('clicked');
	}
	render(){
		return <div className='container'>
                <button className='start-game-button' onClick={this.onClickHandler}>
								Start Game 
								</button> 
						</div>; 	
		}
}

export {AppCls};