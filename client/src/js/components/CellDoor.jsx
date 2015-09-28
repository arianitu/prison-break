import React from 'react';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Input from 'react-bootstrap/lib/Input';

export default React.createClass({
  getDefaultProps() {
    return {
      cellNumber: 0
    };
  },

  getInitialState() {
    return {
      unlocked:Math.random()<0.5?true:false
    }
  },

  render() {

    let doorImageSrc = this.state.unlocked ? "images/door_unlocked.png" : "images/door_locked.png";

    return (
      <div className="cellDoor">
        <img className="cellDoorImg" src={doorImageSrc} />
        <div className="cellDoorLabel">
        {this.props.cellNumber}
        </div>
      </div>
    )
  }
});
