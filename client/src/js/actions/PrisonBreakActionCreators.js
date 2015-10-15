import Dispatcher from '../Dispatcher';
import Constants from '../Constants';

export default {
  
  resetGame() {

    for ( let deviceIdx = 0; deviceIdx < 3; ++deviceIdx ) {
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", "http://prison-break.localhost.com:8888/utils/control_led.php?deviceIdx="+deviceIdx+"&command=color=red&r=1", true);
      xhttp.send();
    }

    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.RESET_GAME
    });
  },

  unlockMainGate(deviceIdx) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://prison-break.localhost.com:8888/utils/control_led.php?deviceIdx="+deviceIdx+"&command=color=green&r=1", true);
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
