import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton'
import LioWebRTC from 'liowebrtc';
import './Party.css';

class Party extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nick: this.props.nick,
      roomID: `liowebrtc-vdemo-party-${this.props.roomName}`,
      peers: [],
      mutedPeerIds: [],
      inRoom: false,
      muted: false,
      windowColor: this.props.windowColor
    };
    this.remoteVideos = {};
  }

  componentDidMount() {
    this.webrtc = new LioWebRTC({
      // The url for your signaling server
      url: 'https://sandbox.simplewebrtc.com:443/',
      // The local video ref set within your render function
      localVideoEl: this.localVid,
      // Immediately request camera access
      autoRequestMedia: true,
      // Optional: nickname
      nick: this.state.nick,
      debug: true
    });

    this.webrtc.on('videoAdded', this.addVideo);
    this.webrtc.on('videoRemoved', this.removeVideo);
    this.webrtc.on('readyToCall', this.readyToCall);
    this.webrtc.on('iceFailed', this.handleConnectionError);
    this.webrtc.on('connectivityError', this.handleConnectionError);
    this.webrtc.on('mute', this.handlePeerMute);
    this.webrtc.on('unmute', this.handlePeerUnmute);
    this.webrtc.on('receivedPeerData', this.handlePeerData);
    this.webrtc.on('channelOpen', this.handleChannelOpen);
  }

  addVideo = (stream, peer) => {
    this.setState({ peers: [...this.state.peers, peer] }, () => {
      this.webrtc.attachStream(stream, this.remoteVideos[peer.id]);
    });
  }

  removeVideo = (peer) => {
    this.setState({
      peers: this.state.peers.filter(p => !p.closed)
    });
  }

  handlePeerData = (type, data, peer) => {
    switch (type) {
      case 'windowColor':
        peer.bColor = `rgb(${data.r}, ${data.g}, ${data.b})`;
        this.setState({ roomCount: this.webrtc.getPeers().length });
        break;
      default:
        break;
    }
  }

  handleChannelOpen = () => {
    this.webrtc.shout('windowColor', this.state.windowColor);
  }

  handleConnectionError = (peer) => {
    const pc = peer.pc;
    console.log('had local relay candidate', pc.hadLocalRelayCandidate);
    console.log('had remote relay candidate', pc.hadRemoteRelayCandidate);
  }

  handleSelfMute = () => {
    const muted = this.state.muted;
    if (muted) {
      this.webrtc.unmute();
    } else {
      this.webrtc.mute();
    }
    this.setState({ muted: !muted });
  }

  handlePeerMute = (data) => {
    if (!this.state.mutedPeerIds.includes(data.id)) {
      this.setState({ mutedPeerIds: [...this.state.mutedPeerIds, data.id] });
    }
  }

  handlePeerUnmute = (data) => {
    this.setState({ mutedPeerIds: this.state.mutedPeerIds.filter(id => id !== data.id) });
  }

  readyToCall = () => {
    // Starts the process of joining a room.
    this.webrtc.joinRoom(this.state.roomID, (err, desc) => {
      this.setState({ inRoom: true });
    });
  }

  // Show fellow peers in the room
  generateRemotes = () => this.state.peers.map((p) => (
    <div key={p.id}>
      <div
        className="vidContainer"
        style={{ borderColor: p.bColor }}
        id={/* The video container needs a special id */ `${this.webrtc.getContainerId(p)}`}>
        <video
          // Important: The video element needs both an id and ref
          id={this.webrtc.getId(p)}
          ref={(v) => this.remoteVideos[p.id] = v}
          playsInline
          autoPlay
          />
        <div
          className={`overlay ${this.state.mutedPeerIds.includes(p.id) ? 'visible' : ''}`}
          >
            <div className="overlayBottom">
              {
                this.state.mutedPeerIds.includes(p.id) &&
                <i className="material-icons">volume_off</i>
              }
            </div>
        </div>
      </div>
        <p>{p.nick}</p>
    </div>
    ));

  disconnect = () => {
    this.webrtc.stopLocalVideo();
    this.webrtc.leaveRoom();
    this.webrtc.disconnect();
  }

  componentWillUnmount() {
    this.disconnect();
  }

  render() {
    return (
      <div
        className={this.state.inRoom ? 'inRoom' : 'wrapper'}
        >
        <div>
          <div
            className="vidContainer"
            style={{ borderColor: `rgb(${this.state.windowColor.r}, ${this.state.windowColor.g}, ${this.state.windowColor.b})` }}
            >
            <video
              // Important: The local video element needs to have a ref
              ref={(vid) => { this.localVid = vid; }}
              playsInline
              muted
              autoPlay
            />
            <div
              className={`overlay ${this.state.muted ? 'visible' : ''}`}
              >
                <div className="overlayMiddle">
                  <IconButton
                    tooltip={this.state.muted ? 'Unmute' : 'Mute'}
                    onClick={this.handleSelfMute}
                    >
                      <i className="material-icons">{this.state.muted ? 'volume_off' : 'volume_up'}</i>
                  </IconButton>
                </div>
            </div>
          </div>
            <p>{this.state.nick}</p>
        </div>
        {this.generateRemotes()}
      </div>
    );
  }
}

export default Party;
