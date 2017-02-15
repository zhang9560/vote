import React, { Component } from 'react';
import Constants from './Constants';
import Utils from './Utils';

import './Common.css';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      dataGot: false,
      submitted: false
    };
    this.data = {};
    this.id = {};

    document.title = '投票详情';
    this._getVote(Utils.getQueryString(window.location.search, 'id'));
  }

  _getVote(voteId) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText);
        let respObj = JSON.parse(xhr.responseText);
        if (respObj.result === 0 && respObj.data !== undefined) {
          this.data = respObj.data;
          this.id = respObj.id;
          this.setState({dataGot: true, submitted: respObj.submitted});
        }
      }
    });
    xhr.open('GET', Constants.host + '/get_vote?id=' + voteId + "&uid=" + Utils.getQueryString(window.location.search, 'uid'), true);
    xhr.send();
  }

  render() {
    return (
      <div className='Vote-details-container'>
          <label>{this.data.title}</label>
          <label className='description'>单选</label>
      </div>
    );
  }
}

export default App;
