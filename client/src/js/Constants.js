import keyMirror from 'react/lib/keyMirror';

export default {
  // event name triggered from store, listened to by views
  CHANGE_EVENT: 'change',

  // Each time you add an action, add it here... They should be past-tense
  ActionTypes: keyMirror({
    RESET_GAME: null,
    TRY_COMBINATION: null,
    START_GAME: null,
    PAUSE_GAME:null,
    DELTA_TIME:null,
    UNLOCK_CELL:null,
    CLEAR_ALARMS:null,
    CHECK_DOOR_LOCKS:null,
    TRIGGER_FAULTY_DOOR: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  }),

};
