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
          <label key={itemData.key} className='Vote-choice-item'>
            <input type='radio' name='item' value={itemData.value} onChange={(event) => this._choose(event.target.value)} />
           {itemData.value}
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