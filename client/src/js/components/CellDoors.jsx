import React from 'react';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Input from 'react-bootstrap/lib/Input';
import CellDoor from './CellDoor.jsx';

export default React.createClass({
  getDefaultProps() {
    return {
      totalCells: 8
    };
  },

  getInitialState() {
    return {
      unlocked:false
    }
  },

  render() {
    let cells = [];
    for ( let idxCell = 0; idxCell < this.props.totalCells; ++idxCell ) {
      cells[idxCell] = <CellDoor cellNumber={idxCell+1} />;
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
