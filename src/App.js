import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton'
import './App.css';
import Party from './components/Party';
import AddFriendDialog from './components/AddFriendDialog';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startChat: false,
      nick: '',
      roomName: '',
      sharing: false
    }
  }

  componentDidMount() {
    this.roomNameInput.focus();
    if (window.location.hash && window.location.hash.length > 1) {
      this.setState({ roomName: window.location.hash.slice(1) });
      this.nickInput.focus();
    }
  }

  handleStart = () => {
    if (!this.state.nick || !this.state.roomName) {
      alert('Please enter all fields.');
      return;
    }
    this.setState({ startChat: true });
    window.location.hash = `#${this.state.roomName}`;
  }

  handleShareDialogClose = () => {
    this.setState({
      sharing: false
     });
  }

  handleInvite = () => this.setState({ sharing: true });

  handleQuit = () => this.setState({ startChat: false });

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="header">
            <h1>P2P Video Chat Demo</h1>
            <p>To try this out, open this page in another tab, or send this page to a friend. Open dev tools to see the logging.
              To view the source code for this app, <a href="https://github.com/lazorfuzz/liowebrtc-video-demo" target="_blank" rel="noopener noreferrer">click here</a>. This app is powered by <a href="https://github.com/lazorfuzz/liowebrtc" target="_blank" rel="noopener noreferrer">LioWebRTC</a>.
              <br /><br />
              <a className="github-button" href="https://github.com/lazorfuzz/liowebrtc" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star lazorfuzz/liowebrtc on GitHub">Star LioWebRTC on GitHub</a></p>
          </div>
          {
            !this.state.startChat &&
            <div className="setup">
              <input
                className="textBox"
                type="text"
                placeholder="Room Name"
                value={this.state.roomName}
                ref={(el) => this.roomNameInput = el}
                onChange={(e) => { this.setState({ roomName: e.target.value }) }}
              />
              <input
                className="textBox"
                type="text"
                placeholder="Nickname"
                value={this.state.nick}
                ref={(el) => this.nickInput = el}
                onChange={(e) => { this.setState({ nick: e.target.value }) }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    this.handleStart();
                  }
                }}
              />
              <button
                className="btn"
                onClick={this.handleStart}
                >Enter</button>
            </div>
          }
          {
            this.state.startChat &&
            <div className="partyWrapper">
              <div className="controls">
                <p className="roomName">Room Name: <span className="roomLabel">{`${this.state.roomName}`}</span></p>
                <div className="menu">
                  <IconButton
                    iconStyle={{ color: 'white' }}
                    tooltip="Add Friends"
                    onClick={this.handleInvite}
                    >
                      <i className="material-icons">group_add</i>
                  </IconButton>
                  <IconButton
                    iconStyle={{ color: 'white' }}
                    tooltip="Quit"
                    onClick={this.handleQuit}
                    >
                      <i className="material-icons">power_settings_new</i>
                  </IconButton>
                </div>
              </div>
              <Party
                roomName={`liowebrtc-vchat-demo-${this.state.roomName}`}
                nick={this.state.nick}
              />
            </div>
          }
          {
            this.state.sharing &&
            <AddFriendDialog
              roomName={this.state.roomName}
              onRequestClose={this.handleShareDialogClose}
            />
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
