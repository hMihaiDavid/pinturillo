import React, { Component } from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';

import Home from './components/Home';
import Game from './components/Game';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/room/:id' component={Game}/>

            <Redirect to='/' />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
