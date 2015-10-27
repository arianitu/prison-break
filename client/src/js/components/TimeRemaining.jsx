import React from 'react';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Input from 'react-bootstrap/lib/Input';
import CellDoor from './CellDoor.jsx';
import PrisonBreakStore from './../stores/PrisonBreakStore.js';

export default React.createClass({
  getDefaultProps() {
    return {
      totalCells: 8
    };
  },

  getInitialState() {
    return {
      secondsRemaining: 0,
      timeoutId: 0,
      paused:true
    }
  },

  pad(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  },

  _change() {
    let prisonState = PrisonBreakStore.getState();
    this.setState({cellDoorStates:prisonState.cellDoorStates,paused:prisonState.paused});
    if ( prisonState.newTime ) {
      this.setState({secondsRemaining:prisonState.newTime});
    }

    if ( prisonState.deltaSeconds ) {
      this.setState({secondsRemaining:this.state.secondsRemaining+prisonState.deltaSeconds});
    }
  },

  componentDidMount() {
    console.log("componentDidMount");
    PrisonBreakStore.addChangeListener(this._change);
    this.startTimer();
  },

  startTimer() {
    let me = this;
    var currentIntervalId = setInterval( () => {
      if ( me.state.paused ) {
        return;
      }
      var newTime = this.state.secondsRemaining-1;

      if ( newTime == 0 ) {
        var audio = new Audio('audio/wrong_door_code.mp3');
        audio.play();
      }
      if ( newTime <= 0 ) {
        newTime = 0;
      } else if ( newTime <= 10 ) {
        var audio = new Audio('audio/time_left.mp3');
        audio.play();  
      }
      
      me.setState({secondsRemaining:newTime})
    }, 1000);
    this.setState({timeoutId:currentIntervalId,isRunning:true});
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
