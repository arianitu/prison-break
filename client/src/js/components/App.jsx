import React, {PropTypes} from 'react';
import CellDoors from './CellDoors.jsx';
import NoiseMonitor from './NoiseMonitor.jsx';
import TimeRemaining from './TimeRemaining.jsx';
import PrisonBreakActionCreator from '../actions/PrisonBreakActionCreators.js';
import PrisonBreakStore from '../stores/PrisonBreakStore.js';

import Constants from './../Constants.js';

export default React.createClass({
  propTypes: {
  },

  getDefaultProps() {
    return {
      tasks: []
    }
  },

  componentDidMount() {
    PrisonBreakActionCreator.resetGame();

    //PrisonBreakActionCreator.tryCombination('021022');

    //var serversocket = new WebSocket("ws://192.168.1.138:8752/scary");
    var serversocket = new WebSocket("ws://localhost:8752/scary");

    serversocket.onopen = function() {
      serversocket.send("Connection init");
    }

    // Write message on receive
    serversocket.onmessage = function(e) {
      console.log("Received: " + e.data);
      var messageData = JSON.parse(e.data);
      if ( e.data.code ) {
        PrisonBreakActionCreator.tryCombination(e.data.code);
      }
    };

    window.onkeypress = function(e) {
      console.log(e.keyCode);
      switch ( e.keyCode ) {
        case "r".charCodeAt(0):
          PrisonBreakActionCreator.resetGame();
          break;
        case "s".charCodeAt(0):
          PrisonBreakActionCreator.startGame();
          break;
        case "p".charCodeAt(0):
          PrisonBreakActionCreator.pauseGame();
          break;
        case 45: // minus
        PrisonBreakActionCreator.deltaTime(-60);
          break;
        case 43: // plus
        PrisonBreakActionCreator.deltaTime(60);
          break;
      }
    }

  },

  render() {
    let {onAddTask, onClear, tasks} = this.props;

    return (
      <div>
        <TimeRemaining />
        <CellDoors />
      </div>
    );
  }
});
