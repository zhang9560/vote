import React, { Component } from 'react';
import Constants from './Constants';
import Utils from './Utils';
import VoteChoiceList from './VoteChoiceList';

import './Common.css';
import './App.css';

class App extends Component {
  constructor() {
    super();

    document.title = '投票详情';

    this.state = {
      dataGot: false,
      chose: false,
      submitted: false
    };

    this.data = {};
    this.id = {};
    this.item = {};
    this.uid = Utils.getQueryString(window.location.search, 'uid');
    console.log('uid = ' + this.uid);

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
    xhr.open('GET', Constants.host + '/get_vote?id=' + voteId + "&uid=" + this.uid, true);
    xhr.send();
  }

  _submit() {
    if (this.item !== undefined) {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          this.setState({submitted: true});
          alert('submitted');
        }
      });
      xhr.open('POST', Constants.host + '/vote', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({uid: this.uid, item: this.item, id: this.id}));
    }
  }

  _choose(value) {
    console.log(value);
    this.item = value;
    this.setState({chose: true});
  }

  render() {
    return (
      <div className='Vote-details-container'>
          <label>{this.data.title}</label>
          
          <label className='description'>单选</label>
          {(() => {
              if (this.state.dataGot) {
                return (<VoteChoiceList items={this.data.items} onChoose={(value) => {this._choose(value);}} />);
              }
            })()
          }

          {(() => {
              if (this.state.dataGot) {
                return (<div style={{backgroundColor:'#f0f0f0', textAlign:'center'}}>
                          <button type='button' disabled={!this.state.chose || this.state.submitted} style={{marginTop:'1rem', marginBottom:'1rem'}} onClick={() => {this._submit()}}>投票</button>
                        </div>);
              }
            })()
          }
      </div>
    );
  }
}

export default App;
