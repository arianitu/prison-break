import React, {PropTypes} from 'react';
import CellDoors from './CellDoors.jsx';
import NoiseMonitor from './NoiseMonitor.jsx';
import TimeRemaining from './TimeRemaining.jsx';

export default React.createClass({
  propTypes: {
    
  },

  getDefaultProps() {
    return {
      tasks: []
    }
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
