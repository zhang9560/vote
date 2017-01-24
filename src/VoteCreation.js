import React, { Component } from 'react';
import './App.css';
import Constants from './Constants';
import Utils from './Utils';

class VoteCreation extends Component {
  constructor() {
    super();
    document.title = '创建投票'
    console.log("search = " + window.location.search);
    console.log(window.location.href);
    this.target = Utils.getQueryString(window.location.search, 'target');
  }

  _submit() {
    let voteTitle = document.getElementsByClassName('Vote-title')[0].value;
    if (voteTitle === '') {
      alert('请填写标题');
      return;
    }

    let voteObj = {};
    voteObj.title = voteTitle;
    voteObj.items = [];

    let idx = 0;
    let voteItems = document.getElementsByClassName('Vote-item');
    for (let i = 0; i < voteItems.length; i++) {
      if (voteItems[i].value !== '') {
        voteObj.items[idx++] = {key: voteItems[i].name, value: voteItems[i].value};
      }
    }
    if (voteObj.items.length < 2) {
      alert('请填写两个或以上选项');
      return;
    }

    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText);
        let respObj = JSON.parse(xhr.responseText);
        if (window.cordova !== undefined) {
          window.cordova.exec((result) => {
            window.cordova.exec(null, null, 'StartActivity', 'finish', []);
          }, null, 'MessagingService', 'sendMessage', [28, this.target, voteObj.title, respObj.id]);
        }
      }
    });
    xhr.open('POST', 'http://' + Constants.HOST() + '/create_vote', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(voteObj));
  }

  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>创建投票</h2>
        </div>
        <form className='Items'>
          <div>
            <label className='Vote-item-label'>标题: </label>
            <input type='text' className='Vote-title' />
          </div>
          <div>
            <label className='Vote-item-label'>选项1: </label>
            <input type='text' className='Vote-item' name='item1' />
          </div>
          <div>
            <label className='Vote-item-label'>选项2: </label>
            <input type='text' className='Vote-item' name='item2' />
          </div>
          <div>
            <label className='Vote-item-label'>选项3: </label>
            <input type='text' className='Vote-item' name='item3' />
          </div>
          <div>
            <label className='Vote-item-label'>选项4: </label>
            <input type='text' className='Vote-item' name='item4' />
          </div>
          <div>
            <label className='Vote-item-label'>选项5: </label>
            <input type='text' className='Vote-item' name='item5' />
          </div>
          <div className='Items-title'>
            <input type='button' value='创建' onClick={() => this._submit()} />
          </div>
        </form>
      </div>
    );
  }
}

export default VoteCreation;
