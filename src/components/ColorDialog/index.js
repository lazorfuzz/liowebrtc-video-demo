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
        title="Add Friends"
        contentStyle={{ maxWidth: 600 }}
        bodyStyle={dStyle}
        titleStyle={dStyle}
        modal={false}
        open={true}
        onRequestClose={this.props.onRequestClose}
        >
        <p>Change your video window color.</p>
        <ColorPicker />
        <button
          className="btn"
          onClick={this.handleShareUrlCopy}
          >{this.state.copyButtonText}</button>
      </Dialog>
    );
  }
}

export default ColorDialog;
