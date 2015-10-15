import Dispatcher from '../Dispatcher';
import Constants from '../Constants';

export default {
  
  resetGame() {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.RESET_GAME
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
