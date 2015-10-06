import Dispatcher from '../Dispatcher';
import Constants from '../Constants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import SeedRandom from 'seedrandom';

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
      cellDoorStates:[
      ],
      cellDoorCombinations:[
      ]
    };

    let rnd = SeedRandom(42);
    for ( let idxCellDoor = 0; idxCellDoor < 8; ++idxCellDoor ) {

      let doorCode = "";
      for ( let idxCodeSlot = 0; idxCodeSlot < 6; ++idxCodeSlot ) {
        doorCode += ""+(Math.floor(rnd()*3));
      }

      this.prisonState.cellDoorStates[idxCellDoor] = 0;
      this.prisonState.cellDoorCombinations[idxCellDoor] = doorCode;
      console.log("doorcode ", idxCellDoor, doorCode);
    }

  },

  checkCode(tryCode) {
    var prisonState = this.getState();

    for ( var idxDoor = 0; idxDoor < 8; ++idxDoor ) {
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
      case Constants.ActionTypes.RESET_GAME:
        PrisonBreakStore.setDefaultState();
        PrisonBreakStore.emitChange();
        break;
      case Constants.ActionTypes.TRY_COMBINATION:
        let tryCode = action.codeEntered;
        PrisonBreakStore.checkCode(tryCode);
        break;
    }
  })
});

export default PrisonBreakStore;
