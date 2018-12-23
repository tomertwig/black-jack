import React from 'react'
import './app.css'

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
        <img className='table' src={require('./table.jpeg')} />
        <button className='hit-button' onClick={this.onHitHandler}> Hit </button>
        </div>);
    }
		
}

export {StartGame};