import React, { Component } from 'react';
import './VoteChoiceList.css';

class VoteChoicelist extends Component {

    _choose(value) {
        if (this.props.onChoose !== undefined) {
            this.props.onChoose(value);
        }
    }

    render() {
      let items = this.props.items.map((itemData) => {
        return (
          <label key={itemData.key} className='Vote-choice-item' style={{display:'flex'}}>
            {(() => {
              if (this.props.submitted) {
                return (
                  <input type='radio' name='item' value={itemData.value} disabled='true' checked={this.props.checkedItem === itemData.value} />
                );
              } else {
                return (
                  <input type='radio' name='item' value={itemData.value} onChange={(event) => this._choose(event.target.value)} />
                );
              }
            })()}
            <div>{itemData.value}</div>

            {(() => {
                if (this.props.submitted) {
                  return (
                    <div style={{flexGrow:'1', textAlign:'end'}}>
                      <span style={{fontSize:'1.2rem'}}>{this.props.voteResult[itemData.value] === undefined ? 0 : this.props.voteResult[itemData.value]}</span>
                      <span style={{fontSize:'0.7rem'}}>&nbsp;票</span>
                    </div>                      
                  );
                }
            })()}
          </label>);
      });

      return(
        <div className='Vote-choices-container'>
            {items}
        </div>
      );
    }
}

export default VoteChoicelist;