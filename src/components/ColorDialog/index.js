import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import util from '../Party/util';
import '../../App.css';
import './ColorDialog.css';
import ColorPicker from '../ColorPicker/ColorPicker';

class ColorDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: util.rgb2hex(`rgb(${this.props.color.r}, ${this.props.color.g}, ${this.props.color.b})`)
    }
  }

  render() {
    const dStyle = { background: '#40454f', color: 'white' };

    return (
      <Dialog
        title="Change Color"
        contentStyle={{ maxWidth: '275px' }}
        bodyStyle={dStyle}
        titleStyle={dStyle}
        autoDetectWindowHeight
        modal={false}
        open={true}
        onRequestClose={this.props.onRequestClose}
        >
        <p>Change your video window color.</p>
        <ColorPicker
          value={this.state.color}
          onChange={this.props.onColorChange}
        />
      </Dialog>
    );
  }
}

export default ColorDialog;
