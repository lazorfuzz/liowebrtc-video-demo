import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

class ColorPicker extends Component {
  
  render() {
    return (
      <div style={{ position: 'absolute', zIndex: '2' }}>
        <div
          style={{
            position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px'
          }}
          onClick={this.props.onClick}
                />
        <ChromePicker
          color={this.props.value}
          onChange={this.props.onChange}
                />
      </div>
    );
  }
}

ColorPicker.defaultProps = {
  value: ''
};

export default ColorPicker;
