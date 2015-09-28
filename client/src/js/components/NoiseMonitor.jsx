import React from 'react';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Input from 'react-bootstrap/lib/Input';

export default React.createClass({
  getDefaultProps() {
    return {
      totalCells: 8
    };
  },

  getInitialState() {
    return {
    }
  },

  pad(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  },

  componentDidMount() {
  },

  render() {
    
    return (
      <div>
        <div className="noiseMonitorContainer">
          Audio Level
        </div>
      </div>
    );
  }
});
