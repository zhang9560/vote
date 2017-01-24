import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router'
import App from './App';
import VoteCreation from './VoteCreation';
import './index.css';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App} />
    <Route path="/vote_creation" component={VoteCreation} />
  </Router>),
  document.getElementById('root')
);
