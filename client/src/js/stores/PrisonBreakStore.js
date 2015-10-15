import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import SeedRandom from 'seed-random';

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
      cellDoorCombinations:[
        '10101010', // cell 1
        '10101010',
        '10101010',
        '10101010',
        '10101010',
        '10101010',
        '10101010',
        '10101010', // cell 8
        '10101010', // Mail indicator lock 1
        '10101010', // Mail indicator lock 2
        '10101010', // Mail indicator lock 3
      ]
    };

    for ( let idxCellDoor = 0; idxCellDoor < this.prisonState.cellDoorCombinations.length; ++idxCellDoor ) {
      this.prisonState.cellDoorStates[idxCellDoor] = 0;
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

  checkCode(tryCode) {
    var prisonState = this.getState();

    for ( var idxDoor = 0; idxDoor < this.prisonState.cellDoorCombinations.length; ++idxDoor ) {
      let checkingCode = this.prisonState.cellDoorCombinations[idxDoor];
      if ( checkingCode == tryCode ) {
        this.prisonState.cellDoorStates[idxDoor] = 1;
        break;
      }
    }
    this.emitChange();
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: Dispatcher.register(function(payload) {
    let action = payload.action;

    console.log('dispatcherIndex ', action.type);

    switch(action.type) {

      case Constants.ActionTypes.START_GAME:
        PrisonBreakStore.startGame();
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
    }
  })
});

export default PrisonBreakStore;
