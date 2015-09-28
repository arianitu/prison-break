import Dispatcher from '../Dispatcher';
import Constants from '../Constants';

export default {
  
  resetGame() {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.RESET_GAME
    });
  },

  completeTask(task) {
    console.warn('completeTask action not yet implemented...');
  }
};
