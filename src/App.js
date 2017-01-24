import React, { Component } from 'react';
import './App.css';
import { BarChart } from 'react-d3-components';
import Constants from './Constants';
import Utils from './Utils';

class App extends Component {
  constructor() {
    super();

    this.state = {
      dataGot: false,
      submitted: false
    };
    this.data = {};
    this.id = {};

    document.title = '投票';
    this.getVote(Utils.getQueryString(window.location.search, 'id'));
  }

  getVote(voteId) {
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
    xhr.open('GET', 'http://' + Constants.HOST() + '/get_vote?id=' + voteId + "&uid=" + Utils.getQueryString(window.location.search, 'uid'), true);
    xhr.send();
  }

  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>{this.data.title}</h2>
        </div>
        
        {(() => {
          if (this.state.dataGot && this.data.items !== undefined) {
            let VoteItemList = React.createClass({

              getInitialState: function() {
                this.uid = Utils.getQueryString(window.location.search, 'uid');
                return {
                  chosen: false,
                  submitted: false,
                  showResult: false
                };
              },

              _choose: function(item) {
                console.log(item);
                this.item = item;
                this.setState({chosen: true});
              },

              _submit: function() {
                if (this.item !== undefined) {
                  let xhr = new XMLHttpRequest();
                  xhr.addEventListener('readystatechange', () => {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                      this.setState({submitted: true});
                      alert('submitted');
                    }
                  });
                  xhr.open('POST', 'http://' + Constants.HOST() + '/vote', true);
                  xhr.setRequestHeader('Content-Type', 'application/json');
                  xhr.send(JSON.stringify({uid: this.uid, item: this.item, id: this.props.id}));
                }
              },

              _showResult: function() {
                let xhr = new XMLHttpRequest();
                xhr.addEventListener('readystatechange', () => {
                  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    console.log(xhr.responseText);
                    let resultObj = JSON.parse(xhr.responseText);
                    let voteResult = [{values: []}];
                    for (let idx in resultObj) {
                        voteResult[0].values.push({x: idx, y:resultObj[idx]});
                    }
                    this.voteResult = voteResult;
                    this.setState({showResult: true});
                  }
                });
                xhr.open('GET', 'http://' + Constants.HOST() + '/result?id=' + this.props.id, true);
                xhr.send();
              },

              render: function() {
                var items = this.props.items.map((itemData) => {
                  return (
                    <div key={itemData.key}>
                      <input type='radio' value={itemData.value} name='item' disabled={this.state.submitted} onChange={(event) => this._choose(event.target.value)} />
                      <label>{itemData.value}</label>
                    </div>);
                });

                return (
                  <div>
                    <form className='Items'>
                      {items}
                      <div className='Items-title'>
                        <input type='button' value='提交' disabled={!this.state.chosen || this.state.submitted || this.props.submitted} onClick={() => this._submit()} />
                        <input type='button' value='查看结果' disabled={!this.state.submitted && !this.props.submitted} onClick={() => this._showResult()} />
                      </div>
                    </form>

                    {(() => {
                      if (this.state.showResult) {
                        return (
                          <BarChart className='Chart' width={window.screen.width * 0.8} height={window.screen.height * 0.5} data={this.voteResult} margin={{top: 30, bottom: 30, left: 50, right: 10}} />
                        );
                      }})()
                    }
                  </div>
                    );
                  }
            });

            return (<VoteItemList items={this.data.items} id={this.id} submitted={this.state.submitted} />);
          }
        })()}
      </div>
    );
  }
}

export default App;
