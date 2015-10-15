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

    setInterval(() => {
        PrisonBreakActionCreator.checkDoorLocks("111111111");
      }, 10000);

    // Write message on receive
    serversocket.onmessage = function(e) {
      console.log("Received: " + e.data);
      var messageData = e.data.substring(1,e.data.length-1);
      console.log("messageData: " + messageData);
      messageData = messageData.split(':');
      var type = messageData[0];
      var content = messageData[1];
      content = content.substr(1, content.length-2);
      console.log("type, content", type, content);
      if ( type == 'code' ) {
        PrisonBreakActionCreator.tryCombination(content);
      }else if ( type == 'locks' ) {
        PrisonBreakActionCreator.checkDoorLocks(content);
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
         case "q".charCodeAt(0):
          PrisonBreakActionCreator.unlockMainGate(0);
          break;
        case "w".charCodeAt(0):
          PrisonBreakActionCreator.unlockMainGate(1);
          break;
        case "e".charCodeAt(0):
          PrisonBreakActionCreator.unlockMainGate(2);
          break;
        case 49: // 1
        case 50: // 2
        case 51: // 3
        case 52: // 4
        case 53: // 5
        case 54: // 6
        case 55: // 7
        case 56: // 8
          PrisonBreakActionCreator.unlockCell(e.keyCode-49);
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
