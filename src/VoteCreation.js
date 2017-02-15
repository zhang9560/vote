import React, { Component } from 'react';
import Constants from './Constants';
import Utils from './Utils';

import './Common.css';
import './VoteCreation.css';

class VoteCreation extends Component {
  constructor() {
    super();
    document.title = '发布投票'
    console.log("search = " + window.location.search);
    this.target = Utils.getQueryString(window.location.search, 'target');
  }

  _submit() {
    let voteTitle = document.getElementsByClassName('Vote-title')[0].value;
    if (voteTitle === '') {
      if (window.cordova !== undefined) {
        window.cordova.exec(null, null, 'MessagingService', 'showToast', ['请填写标题', 0]);
      } else {
        alert('请填写标题');
      }
      return;
    }

    let voteObj = {};
    voteObj.title = voteTitle;
    voteObj.items = [];

    let idx = 0;
    let voteItems = document.getElementsByClassName('Vote-item-text');
    for (let i = 0; i < voteItems.length; i++) {
      if (voteItems[i].value !== '') {
        voteObj.items[idx++] = {key: voteItems[i].name, value: voteItems[i].value};
      }
    }
    if (voteObj.items.length < 2) {
      if (window.cordova !== undefined) {
        window.cordova.exec(null, null, 'MessagingService', 'showToast', ['请填写两个或以上选项', 0]);
      } else {
        alert('请填写两个或以上选项');
      }
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
    xhr.open('POST', Constants.host + '/create_vote', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(voteObj));
  }

  render() {
    return (
      <div className='App'>
        <form className='Items'>
          <div>
            <textarea maxLength='80' rows='3' placeholder='输入投票主题，2-80字' className='Vote-title'></textarea>
          </div>

          <div className='Vote-items-container'>
            <div className='Vote-item'>
              <input type='text' className='Vote-item-text' name='item1' placeholder='选项1' maxLength='40' />
            </div>
            <div className='Vote-item'>
              <input type='text' className='Vote-item-text' name='item2' placeholder='选项2' maxLength='40' />
            </div>
            <div className='Vote-item'>
              <input type='text' className='Vote-item-text' name='item3' placeholder='选项3' maxLength='40' />
            </div>
            <div className='Vote-item'>
              <input type='text' className='Vote-item-text' name='item4' placeholder='选项4' maxLength='40' />
            </div>
            <div className='Vote-item'>
              <input type='text' className='Vote-item-text' name='item5' placeholder='选项5' maxLength='40' />
            </div>
          </div>

          <div className='Description'>最多支持5个选项，每个选项不能超过40个字</div>

          <div className='Button' onClick={this._submit}>发布</div>
        </form>
      </div>
    );
  }
}

export default VoteCreation;
