import Dispatcher from '../Dispatcher';
import Constants from '../Constants';

export default {
  
  mainGateStatus : [0,0,0],
  ledControlScript : "http://prison-break.localhost.com:8888/utils/control_led.php",

  resetGame() {

    for ( let deviceIdx = 0; deviceIdx < 3; ++deviceIdx ) {

      this.mainGateStatus[deviceIdx] = 0;

      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", this.ledControlScript+"?deviceIdx="+deviceIdx+"&command=color=red&r=1", true);
      xhttp.send();
    }

    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.RESET_GAME
    });

  },

  unlockMainGate(deviceIdx, fromToggle) {
    var xhttp = new XMLHttpRequest();
    if ( fromToggle ) {
      this.mainGateStatus[deviceIdx] = this.mainGateStatus[deviceIdx] ? 0 : 1;
    } else {
      this.mainGateStatus[deviceIdx] = 1;
    }

    var command = this.mainGateStatus[deviceIdx] == 0 ? "color=red" : "color=green";
    var scriptUrl = this.ledControlScript+"?deviceIdx="+deviceIdx+"&command="+command;
    console.log(scriptUrl);
    xhttp.open("GET", scriptUrl, true);
    xhttp.send();
  },

  unlockCell(idxDoor) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.UNLOCK_CELL,
      idxDoor: idxDoor
    });
  },

  clearAlarms() {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CLEAR_ALARMS
    });
  },

  checkDoorLocks(doorStates) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CHECK_DOOR_LOCKS,
      doorStates:doorStates
    });
  },

  startGame() {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.START_GAME
    });
  },

  pauseGame() {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.PAUSE_GAME
    });
  },

  deltaTime(deltaSeconds) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.DELTA_TIME,
      deltaSeconds:deltaSeconds
    });
  },

  tryCombination(codeEntered) {
  	Dispatcher.handleViewAction({
      type: Constants.ActionTypes.TRY_COMBINATION,
      codeEntered: codeEntered
    });
  },

  completeTask(task) {
    console.warn('completeTask action not yet implemented...');
  }
};
