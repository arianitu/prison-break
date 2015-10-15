import React from 'react';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Input from 'react-bootstrap/lib/Input';
import CellDoor from './CellDoor.jsx';
import PrisonBreakStore from '../stores/PrisonBreakStore.js';
import PrisonBreakActionCreator from '../actions/PrisonBreakActionCreators.js';

export default React.createClass({
  getDefaultProps() {
    return {
      totalCells: 8
    };
  },

  getInitialState() {
    return {
      cellDoorStates: [0,0,0,0,0,0,0,0]
    }
  },

  componentDidMount() {
    PrisonBreakStore.addChangeListener(this._change);
  },

  _change() {
    let prisonState = PrisonBreakStore.getState();
    this.setState({cellDoorStates:prisonState.cellDoorStates,alarm:prisonState.alarm});
  },

  render() {
    let cells = [];
    if ( !this.state.alarm ) {
      for ( let idxCell = 0; idxCell < this.props.totalCells; ++idxCell ) {
        cells[idxCell] = <CellDoor unlocked={this.state.cellDoorStates[idxCell]} cellNumber={idxCell+1} />;
      }
    } else {
      cells[0] = <div className="invalidCodeEntered">{this.state.alarm}</div>;
      setTimeout(() => {
        PrisonBreakActionCreator.clearAlarms();
      }, 5000);
    }

    return (
      <div>
        <div className="cellDoors">
          {cells.map(function(idxCell) {
            return idxCell;
          })}
        </div>
      </div>
    );
  }
});
