import React, { Component } from 'react';
import { ChromePicker } from 'react-color';
import TextField from 'material-ui/TextField';
import converters, { DEFAULT_CONVERTER } from './colorConverter';
import ColorPicker from './ColorPicker';

class ColorField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPicker: false
    };
  }

  render() {
    return (
      <div>
        <TextField
          underlineFocusStyle={this.props.underlineFocusStyle}
          floatingLabelFocusStyle={this.props.floatingLabelFocusStyle}
          inputStyle={this.props.inputStyle}
          floatingLabelStyle={this.props.floatingLabelStyle}
          hintText={this.props.hintText}
          value={this.props.value}
          errorText={this.props.errorText}
          floatingLabelText={this.props.floatingLabelText}
          onClick={() => {
            this.setState({
              showPicker: true,
            });
          }}
          onChange={(e) => {
            this.props.onChange(e.target.value);
          }}
                />
        {
                    this.state.showPicker && (
                    <ColorPicker
                      value={this.props.value}
                      onClick={() => {
                        this.setState({
                          showPicker: false
                        });
                        this.props.onChange(this.props.value);
                      }}
                      onChange={(c) => {
                        const newValue = converters[this.props.convert](c);
                        this.props.onChange(newValue);
                      }}
                        />
                    )
                }
      </div>
    );
  }
}

ColorField.defaultProps = {
  value: '',
  convert: DEFAULT_CONVERTER
};

export default ColorField;
