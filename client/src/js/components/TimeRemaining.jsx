import React from 'react';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Input from 'react-bootstrap/lib/Input';
import CellDoor from './CellDoor.jsx';

export default React.createClass({
  getDefaultProps() {
    return {
      totalCells: 8
    };
  },

  getInitialState() {
    return {
      // h + m + s
      secondsRemaining: (0*60*60)+(45*60)+0,
      timeoutId: 0
    }
  },

  pad(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  },

  componentDidMount() {
    console.log("componentDidMount")
    let me = this;
    setInterval( () => {
      var newTime = this.state.secondsRemaining-1;
      if ( newTime <= 0 ) {
        newTime = (0*60*60)+(45*60)+0;
      }
      me.setState({secondsRemaining:newTime})
    }, 1000);
  },

  secondsToString(seconds) {
    var numyears = Math.floor(seconds / 31536000);
    var numdays = Math.floor((seconds % 31536000) / 86400); 
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    //return numyears + " years " +  numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
    return this.pad(numminutes, 2) + ":" + this.pad(numseconds, 2);
  },

  render() {
    
    let timeRemaining = this.secondsToString(this.state.secondsRemaining);

    return (
      <div className="timeRemainingContainer">
        <div>
          {timeRemaining}
        </div>
      </div>
    );
  }
});
