import React, {PropTypes} from 'react';
import CellDoors from './CellDoors.jsx';
import NoiseMonitor from './NoiseMonitor.jsx';
import TimeRemaining from './TimeRemaining.jsx';
import PrisonBreakActionCreator from '../actions/PrisonBreakActionCreators.js';
import PrisonBreakStore from '../stores/PrisonBreakStore.js';

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
      var msgType = e.data[0];
      var msgContents = e.data.substr(1);
      switch ( msgType ) {
        case 'k':
          PrisonBreakActionCreator.tryCombination(msgContents);
          break;
        case 'r':
          PrisonBreakActionCreator.resetGame();
          break;
      }
    };

  },

  render() {
    let {onAddTask, onClear, tasks} = this.props;

    return (
      <div>
        <TimeRemaining />
        <NoiseMonitor />
        <CellDoors />
      </div>
    );
  }
});
