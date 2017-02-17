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
    this.voteNumber = 0;
    this.voteResult = {};
    this.uid = Utils.getQueryString(window.location.search, 'uid');

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

          if (respObj.submitted) {
            this._getResult(voteId);
          } else {
            this.setState({dataGot: true});
          }
        }
      }
    });
    xhr.open('GET', Constants.host + '/get_vote?id=' + voteId + "&uid=" + this.uid, true);
    xhr.send();
  }

  _getResult(voteId) {
    console.log("voteId = " + voteId);
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText);
        this.voteResult = JSON.parse(xhr.responseText);
        for (let key in this.voteResult.progress) {
          this.voteNumber += this.voteResult.progress[key];
        }
        
        this.setState({dataGot: true, submitted: true});
      }
    });
    xhr.open('GET', Constants.host + '/result?id=' + voteId, true);
    xhr.send();
  }

  _submit() {
    if (this.item !== undefined) {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          this._getResult(this.id);
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
          <label style={{marginTop:'1rem'}}>{this.data.title}</label>
          
          <div style={{marginTop:'1rem', marginBottom:'0.5rem', display:'flex', justifyContent:'space-between', paddingRight:'1rem'}}>
            <label className='description'>单选</label>
            {(() => {
              if (this.state.submitted) {
                return (<label className='description'>共{this.voteNumber}票</label>);
              }
            })()}
          </div>

          {(() => {
              if (this.state.dataGot) {
                let checkedItem = null;
                if (this.state.submitted) {
                  for (let i = 0; i < this.voteResult.detail.length; i++) {
                    if (this.voteResult.detail[i].uid === this.uid) {
                      checkedItem = this.voteResult.detail[i].item;
                      break;
                    }
                  }
                }

                return (<VoteChoiceList items={this.data.items} voteResult={this.voteResult.progress} submitted={this.state.submitted} checkedItem={checkedItem} onChoose={(value) => {this._choose(value);}} />);
              }
            })()
          }

          {(() => {
              if (this.state.dataGot && !this.state.submitted) {
                return (
                  <div style={{backgroundColor:'#f0f0f0', textAlign:'center'}}>
                    <button type='button' disabled={!this.state.chose || this.state.submitted} style={{marginTop:'1rem', marginBottom:'1rem'}} onClick={() => {this._submit()}}>投票</button>
                  </div>
                );
              }
            })()
          }
      </div>
    );
  }
}

export default App;
