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


    let rndAudio = ['creaky_door.mp3','female_scream.mp3','male_scream.mp3','saw.mp3'];

    setInterval( () => {
      if ( Math.random() <= 1.0 ) {

        let audio = new Audio('audio/halloween/'+ rndAudio[Math.floor(Math.random()*rndAudio.length)]  );
        audio.play();
      }
    }, 10*60*1000 );


    PrisonBreakActionCreator.resetGame();

    window.tryCombination = function tryCombination(combination) {
      PrisonBreakActionCreator.tryCombination(combination);
    }

    window.checkDoorLocks = function checkDoorLocks(lockState) {
      PrisonBreakActionCreator.checkDoorLocks(lockState);
    }

    //PrisonBreakActionCreator.tryCombination('021022');

    //var serversocket = new WebSocket("ws://192.168.1.138:8752/scary");
    var serversocket = new WebSocket("ws://localhost:8752/scary");

    serversocket.onopen = function() {
      serversocket.send("Connection init");
    }

    // setInterval(() => {
    //     PrisonBreakActionCreator.checkDoorLocks("000000000");
    //   }, 2000);

    // Write message on receive
    serversocket.onmessage = function(e) {
      // console.log("Received: " + e.data);
      var messageData = e.data.substring(1,e.data.length-1);
      // console.log("messageData: " + messageData);
      messageData = messageData.split(':');
      var type = messageData[0];
      var content = messageData[1];
      content = content.substr(1, content.length-2);
      // console.log("type, content", type, content);
      if ( type == 'code' ) {
        PrisonBreakActionCreator.tryCombination(content);
      }else if ( type == 'locks' ) {
        PrisonBreakActionCreator.checkDoorLocks(content);
      }
    };

    var me = this;
    me.showHelp();

    var isCtrlDown = false;

    window.onkeydown = function(e) {

      switch ( e.keyCode ) {
        case 17:
          isCtrlDown = !isCtrlDown;
          break;
        }

        console.log("isCtrlDown",isCtrlDown);
    }

    window.onkeypress = function(e) {
      // console.log("pass..",e.keyCode);
      //   if ( !isCtrlDown ) {
      //     console.log('no control..');
      //     return;
      //   }
      console.log("key down: ", e.keyCode);
      switch ( e.keyCode ) {
        case "r".charCodeAt(0):
          PrisonBreakActionCreator.resetGame();
          break;
        case "f".charCodeAt(0):
          PrisonBreakActionCreator.triggerFaultyDoor();
          break;
        case "s".charCodeAt(0):
          PrisonBreakActionCreator.startGame();
          break;
        case "p".charCodeAt(0):
          PrisonBreakActionCreator.pauseGame();
          break;
        case 45/*"n".charCodeAt(0)*/: // minus
          PrisonBreakActionCreator.deltaTime(-15);
          break;
        case 43/*"m".charCodeAt(0)*/: // plus
          PrisonBreakActionCreator.deltaTime(15);
          break;
         case "q".charCodeAt(0):
          PrisonBreakActionCreator.unlockMainGate(0, true);
          break;
        case "w".charCodeAt(0):
          PrisonBreakActionCreator.unlockMainGate(0, false, true);
          break;
        case "h".charCodeAt(0):
          me.showHelp();
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

  showHelp() {
    console.log("PRISON ESCAPE");
    console.log("============================================");
    console.log("Command list:");
    console.log("r: reset game");
    console.log("s: start game");
    console.log("f: trigger faulty door");
    console.log("p: pause game");
    console.log("+/- increase / decrese time by 1 minute");
    console.log("1-8: toggle cell door lock");
    console.log("q: reset main gate locks");
    console.log("w: advance main gate locks");
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
