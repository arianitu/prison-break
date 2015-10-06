import React from 'react';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Input from 'react-bootstrap/lib/Input';

export default React.createClass({
  getDefaultProps() {
    return {
      cellNumber: 0,
      unlocked:0
    };
  },

  getInitialState() {
    return {
    }
  },

  componentDidMount() {

  },

  render() {

    let doorImageSrc = this.props.unlocked ? "images/door_unlocked.png" : "images/door_locked.png";

    let doorStyleColor = this.props.unlocked == 0 ? '#ff0000' : '#00ff00';
    let doorStyle = {color:doorStyleColor};
    return (
      <div className="cellDoor">
        <img className="cellDoorImg" src={doorImageSrc} />
        <div style={doorStyle} className="cellDoorLabel">
        {this.props.cellNumber}
        </div>
      </div>
    )
  }
});
