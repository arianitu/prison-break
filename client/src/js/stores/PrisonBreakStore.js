import React from 'react';
import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import SeedRandom from 'seed-random';
import PrisonBreakActionCreator from '../actions/PrisonBreakActionCreators.js';

// Facebook style store creation.
const PrisonBreakStore = assign({}, BaseStore, {

  prisonState: {},

  // public methods used by Controller-View to operate on data
  getState() {
    return this.prisonState;
  },

  setDefaultState() {
    this.prisonState = {
      paused:true,
      newTime:(0*60*60)+(45*60)+0,
      deltaSeconds:0,
      cellDoorStates:[
      ],
      // 2 = up
      // 1 = middle
      // 0 = down
      cellDoorCombinations:[
        '00000000', // cell 1
        '11111111', // cell 2
        '22222222', // cell 3 
        '20202020', // cell 4 
        '12121212', // cell 5
        '10101010', // cell 6
        '10101010', // cell 7
        '10101010', // cell 8
        '33333333', // Mail indicator lock 1
        '44444444', // Mail indicator lock 2
        '55555555', // Mail indicator lock 3
      ]
    };

    for ( let idxCellDoor = 0; idxCellDoor < this.prisonState.cellDoorCombinations.length; ++idxCellDoor ) {
      if ( idxCellDoor == 2 ) {
        this.prisonState.cellDoorStates[idxCellDoor] = 1;  
      } else {
        this.prisonState.cellDoorStates[idxCellDoor] = 0;
      }
    }
    this.emitChange();
    this.prisonState.newTime = null;
  },

  startGame() {
    this.prisonState.paused = false;
    this.emitChange();
  },

  pauseGame() {
    this.prisonState.paused = true;
    this.emitChange();
  },

  deltaTime(deltaSeconds) {
    this.prisonState.deltaSeconds = deltaSeconds;
    this.emitChange();

  },

  clearAlarms() {
    this.prisonState.alarm = null;
    this.emitChange();
  },

  triggerFaultyDoor() {
    let FAULTY_DOOR = 6;

    for ( let idxDoor = 0; idxDoor < 10; ++idxDoor ) {
      setTimeout( () => {
        this.prisonState.cellDoorStates[FAULTY_DOOR-1] = idxDoor%2;
        this.emitChange();
      }, idxDoor*50);
    }
  },

  checkCode(tryCode) {

    if ( this.prisonState.alarm ) {
      return;
    }

    var prisonState = this.getState();

    var foundCode = false;

    var foundNewCodeDoorIndex = -1;

    for ( var idxDoor = 0; idxDoor < this.prisonState.cellDoorCombinations.length; ++idxDoor ) {
      let checkingCode = this.prisonState.cellDoorCombinations[idxDoor];
      if ( checkingCode == tryCode ) {
        foundCode = true;
        if ( this.prisonState.cellDoorStates[idxDoor] == 0 ) {
          foundNewCodeDoorIndex = idxDoor;
        }
        this.prisonState.cellDoorStates[idxDoor] = 1;
        if ( idxDoor >= 8 ) {
          PrisonBreakActionCreator.unlockMainGate(idxDoor-8); 
        }
      }
    }

    if ( foundNewCodeDoorIndex != -1 && foundNewCodeDoorIndex < 8 ) {
      var audio = new Audio('audio/advanced_main_gate.mp3');
      audio.play();
    }

    if ( !foundCode ) {
      this.prisonState.alarm = "Invalid Code Entered!";

      var audio = new Audio('audio/wrong_door_code.mp3');
      audio.play();
    }
    this.emitChange();
  },

  unlockCell(idxDoor) {
    this.prisonState.cellDoorStates[idxDoor] = this.prisonState.cellDoorStates[idxDoor] ? 0 : 1;
    this.emitChange();
  },

  checkDoorLocks(doorStates) {

    if ( this.prisonState.alarm ) {
      return;
    }

    // console.log("checkDoorLocks ", doorStates);
    var OPEN = 0;
    var CLOSED = 1;

    let doorAlarms = [];
    for ( let idxDoor = 0; idxDoor < 8; ++idxDoor ) {
      if ( idxDoor == 5 ) {
        continue;
      }
      if ( this.prisonState.cellDoorStates[idxDoor] == OPEN && doorStates[idxDoor] == 0 ) {
        if ( doorAlarms.length == 0 ) {
          doorAlarms.push("Cell " + (idxDoor+1));
          continue;
        }
        doorAlarms.push( (idxDoor+1) );
      }
    } 

    if ( doorStates[8] == OPEN && (
            this.prisonState.cellDoorStates[8] == 0 ||
            this.prisonState.cellDoorStates[9] == 0 ||
            this.prisonState.cellDoorStates[10] == 0 ) ) {
      doorAlarms.push("Main Gate");
    }

    if ( doorAlarms.length > 0 ) {
      this.prisonState.alarm = "Door Alarm: " + doorAlarms.join(", ");

      var audio = new Audio('audio/alarm_tripped.mp3');
      audio.play();
    }
    this.emitChange();
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;
    // console.log('dispatcherIndex ', action.type);

    switch(action.type) {

      case Constants.ActionTypes.START_GAME:
        PrisonBreakStore.startGame();
        break;

      case Constants.ActionTypes.CHECK_DOOR_LOCKS:
        PrisonBreakStore.checkDoorLocks(action.doorStates);
        break;

      case Constants.ActionTypes.UNLOCK_CELL:
        PrisonBreakStore.unlockCell(action.idxDoor);
        break;

      case Constants.ActionTypes.PAUSE_GAME:
        PrisonBreakStore.pauseGame();
        break;
      case Constants.ActionTypes.DELTA_TIME:
        PrisonBreakStore.deltaTime(action.deltaSeconds);
        break;

      case Constants.ActionTypes.RESET_GAME:
        PrisonBreakStore.setDefaultState();
        break;
      case Constants.ActionTypes.TRY_COMBINATION:
        let tryCode = action.codeEntered;
        PrisonBreakStore.checkCode(tryCode);
        break;
      case Constants.ActionTypes.CLEAR_ALARMS:
        PrisonBreakStore.clearAlarms();
        break;
      case Constants.ActionTypes.TRIGGER_FAULTY_DOOR:
        PrisonBreakStore.triggerFaultyDoor();
        break;
    }
  })
});

export default PrisonBreakStore;
