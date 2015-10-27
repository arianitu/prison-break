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
      noiseLevel:0.4
    }
  },

  pad(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  },

  componentDidMount() {
    /*
    window.AudioContext = window.AudioContext ||
                      window.webkitAudioContext;
    var context = new AudioContext();

    navigator.getUserMedia({audio: true}, () => {
      var microphone = context.createMediaStreamSource(stream);
      var filter = context.createBiquadFilter();

      // microphone -> filter -> destination.
      microphone.connect(filter);
      filter.connect(context.destination);
    }, () => {} );*/
  },

  generateBar() {
    let divs = [];
    let stepInc = 1/32;
    let divId = 0;
    for ( let i = 0; i <= 1; i += stepInc ) {
      let hue=((1-i)*120).toString(10);
      let bgStyle = null;
      if ( this.state.noiseLevel > i ) {
        bgStyle = {
          backgroundColor: 'hsl('+hue+',100%,50%)'
        };
      } else {
        bgStyle = {
          backgroundColor: '#373737'
        };
      }
      
      divs[divId] = <div className="noiseLevelBar" style={bgStyle}>&nbsp;</div>;
      ++divId;
    }

    return divs;
  },

  render() {

    var bars = this.generateBar();
    // console.log(bars);
    return (
      <div>
        <div className="noiseMonitorContainer">
          Audio Level
        </div>
        <div className="noiseLevelMeterBar">
          {bars}
        </div>
      </div>
    );
  }
});
