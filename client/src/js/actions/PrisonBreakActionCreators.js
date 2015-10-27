import Dispatcher from '../Dispatcher';
import Constants from '../Constants';

export default {
  
  mainGateState: 0,
  mainGateLockStatusArr : [0,0,0],
  ledControlScript : "http://127.0.0.1/prison-break/utils/control_led.php",

  resetGame() {

    for ( let deviceIdx = 0; deviceIdx < 3; ++deviceIdx ) {

      this.mainGateLockStatusArr[deviceIdx] = 0;
      this.makeLedRequest(deviceIdx, 'color=red');
    } 

    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.RESET_GAME
    });

  },

  makeLedRequest(deviceIdx, command) {
    var xhttp = new XMLHttpRequest();
    var scriptUrl = this.ledControlScript+"?deviceIdx="+deviceIdx+"&command="+command;
    xhttp.open("GET", scriptUrl, true);
    xhttp.send();
  },

  unlockMainGate(deviceIdx, doReset, advanceState) {

    if ( !advanceState ) {
      this.mainGateLockStatusArr[deviceIdx] = 1;
    }

    if ( doReset ) {
      for ( let idxGateStatus = 0; idxGateStatus < this.mainGateLockStatusArr.length; ++idxGateStatus ) {
        this.mainGateLockStatusArr[idxGateStatus] = 0;
      }
    }

    if ( advanceState ) {
      for ( let idxGateStatus = 0; idxGateStatus < this.mainGateLockStatusArr.length; ++idxGateStatus ) {
        if ( this.mainGateLockStatusArr[idxGateStatus] == 0 ) {
          this.mainGateLockStatusArr[idxGateStatus] = 1;
          break;
        }
      }
    }

    var newMainGateState = 0;
    for ( let idxGateStatus = 0; idxGateStatus < this.mainGateLockStatusArr.length; ++idxGateStatus ) {
      if ( this.mainGateLockStatusArr[idxGateStatus] > 0 ) {
        ++newMainGateState;
      }
    }

    // console.log("Main gate state: ", newMainGateState, this.mainGateLockStatusArr);

    if ( newMainGateState != this.mainGateState ) {

      if ( newMainGateState != 0 ) {
        // ding...
        if ( newMainGateState < 2 ) {
          var audio = new Audio('audio/advanced_main_gate.mp3');
          audio.play();
        // unlocked all 
        } else {
          for ( let idxDoor = 1; idxDoor < 16; ++idxDoor ) {
            setTimeout( () => {
               var audio = new Audio('audio/advanced_main_gate.mp3');
              audio.play();
            }, idxDoor*350);
          }
        }
      }

      if ( newMainGateState == 1 ) {
        this.makeLedRequest(0, 'rgb=0,255,0');
        this.makeLedRequest(1, 'color=red');
      } else if ( newMainGateState == 2 ) {
        this.makeLedRequest(0, 'rgb=0,255,0');
        this.makeLedRequest(1, 'rgb=0,255,0');
      } else if ( newMainGateState == 3 ) {
        this.makeLedRequest(0, 'color=green');
        this.makeLedRequest(1, 'color=green');
      } else {  
        this.makeLedRequest(0, 'color=red');
        this.makeLedRequest(1, 'color=red');
      }
    }
    this.mainGateState = newMainGateState;
    
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

  triggerFaultyDoor() {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.TRIGGER_FAULTY_DOOR
    });
  },

  completeTask(task) {
    console.warn('completeTask action not yet implemented...');
  }
};
