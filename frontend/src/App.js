import React, { Component } from 'react';
import './App.css';

import { HashRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import AppliedRoute from './AppliedRoute';

import PickNick from './components/PickNick';
import PickRoom from './components/PickRoom';
import GameRoom from './components/GameRoom';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {nick: "", lang: 'es'};
  }

  handleSetNick = newNick => {
    this.setState({nick: newNick});
  }

  handleSetLang = newLang => {
    this.setState({lang: newLang});
  }

  render() {
    let global = {
      nick: this.state.nick,
      lang: this.state.lang,

      setNick: this.handleSetNick ,
      setLang: this.handleSetLang
    }

    return (
      <div>
        <header>
          <h1>El Pinturón</h1>
        </header>
        {/*this.state.nick && <p>Your nick is {this.state.nick}</p>*/}
        <Router>
          <div className='game-container'>
          <Switch>
            {/* AppliedRoute is just like a Route but the object passed in addProps is set as props.global 
                in the component. This is how the app handles the nickname.*/}
           
              <AppliedRoute exact path='/' component={PickNick} global={global} />
              <AppliedRoute exact path='/rooms' component={PickRoom} global={global} />              
              <AppliedRoute path='/rooms/:id' component={GameRoom} global={global} />

              <Redirect to='/' />
          </Switch>
          </div>
        </Router>
        <footer>
          
        </footer>
      </div>
    );
  }
}

export default App;
