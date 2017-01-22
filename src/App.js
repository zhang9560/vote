import React, { Component } from 'react';
import './App.css';
import uuid from 'uuid';
import {BarChart} from 'react-d3-components';

class App extends Component {
  constructor() {
    super();
    this.state = {
      submitted: false,
      showResult: false
    };
    this.uid = uuid.v4();

    this.data = [{
      values: [{x: '香蕉', y: 0}, {x: '苹果', y: 0}, {x: '梨', y: 0}]
    }];
  }

  submit() {
    if (this.item !== undefined) {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          this.setState({submitted: true});
          alert("submitted");
        }
      });
      xhr.open("POST", "http://192.168.18.113:8080/vote", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({uid: this.uid, item: this.item}));
    } else {
      alert("choose what to eat first");
    }
  }

  showResult() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
        let resObj = JSON.parse(xhr.responseText);
        this.data[0].values[0].y = resObj["banana"];
        this.data[0].values[1].y = resObj["apple"];
        this.data[0].values[2].y = resObj["pear"];
        this.setState({showResult: true});
      }
    });
    xhr.open("GET", "http://192.168.18.113:8080/result", true);
    xhr.send();
  }

  choose(item) {
    console.log(item);
    this.item = item;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>今天想吃什么？</h2>
        </div>
        <form className="Items">
          <div>
            <input type="radio" name="item" value="banana" disabled={this.state.submitted} onChange={(event) => this.choose(event.target.value)} />
            <label>香蕉</label>
          </div>
          <div>
            <input type="radio" name="item" value="apple" disabled={this.state.submitted} onChange={(event) => this.choose(event.target.value)} />
            <label>苹果</label>
          </div>
          <div>
            <input type="radio" name="item" value="pear" disabled={this.state.submitted} onChange={(event) => this.choose(event.target.value)} />
            <label>梨</label>
          </div>
          <div className="Items-title">
            <input type="button" value="提交" disabled={this.state.submitted} onClick={() => this.submit()} />
            <input type="button" value="查看结果" onClick={() => this.showResult()} />
          </div>
        </form>
        
        {(() => {
          if (this.state.showResult) {
            return (
              <BarChart className="Chart" width={window.screen.width * 0.8} height={window.screen.height * 0.5} data={this.data} margin={{top: 30, bottom: 30, left: 50, right: 10}} />
            );
          }
        })()
      }
      </div>
    );
  }
}

export default App;
