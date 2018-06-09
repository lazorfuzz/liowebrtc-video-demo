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
      muted: false
    };
    this.remoteVideos = {};
  }

  componentDidMount() {
    this.webrtc = new LioWebRTC({
      // The url for your signaling server
      url: 'https://sandbox.simplewebrtc.com:443/',
      // The local video ref set within your render function
      localVideoEl: this.localVid,
      // Optional: nickname
      nick: this.state.nick,
      debug: true
    });

    this.addListeners();

    if (!this.props.iOS) {
      this.webrtc.startLocalVideo();
    } else {
      this.setState({ inRoom: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const pc = prevProps.windowColor;
    const c = this.props.windowColor;
    if (pc.r !== c.r || pc.g !== c.g || pc.b !== c.b) {
      this.webrtc.shout('windowColor', c);
    }
  }

  addListeners = () => {
    this.webrtc.on('videoAdded', this.addVideo);
    this.webrtc.on('videoRemoved', this.removeVideo);
    this.webrtc.on('readyToCall', this.readyToCall);
    this.webrtc.on('iceFailed', this.handleConnectionError);
    this.webrtc.on('connectivityError', this.handleConnectionError);
    this.webrtc.on('mute', this.handlePeerMute);
    this.webrtc.on('unmute', this.handlePeerUnmute);
    this.webrtc.on('receivedPeerData', this.handlePeerData);
    this.webrtc.on('channelOpen', this.handleChannelOpen);
    this.webrtc.on('localMediaError', (e) => alert(`Local Media Error\n\n${e.toString()}\n\nDoes your browser allow camera and mic access?`));
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
        peer.bColor = `rgba(${data.r}, ${data.g}, ${data.b}, ${data.a})`;
        this.setState({ roomCount: this.webrtc.getPeers().length });
        break;
      default:
        break;
    }
  }

  handleChannelOpen = () => this.webrtc.shout('windowColor', this.props.windowColor);

  handleConnectionError = (peer) => {
    const pc = peer.pc;
    console.log('had local relay candidate', pc.hadLocalRelayCandidate);
    console.log('had remote relay candidate', pc.hadRemoteRelayCandidate);
  }

  handleSelfMute = (e) => {
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

  handleVideoStart = () => {
    this.props.handleStartVideo();
    this.webrtc.startLocalVideo();
  }

  handleOverlayHover = (e) => {
    if (!e.target.className.includes('overlay ')) return;
    clearTimeout(e.target.overlayTimeout);
    for (const child of e.target.children) {
      child.style.visibility = 'visible';
    }
    e.target.style.opacity = 1;
    this.setOverlayTimeout(e.target);
  }

  setOverlayTimeout = (tgt) => tgt.overlayTimeout = setTimeout(() => {
        if (!tgt || this.props.iOS) return;
        tgt.style.opacity = 0;
        for (const child of tgt.children) {
          child.style.visibility = 'hidden';
        }
      }, 1000);

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
          />
        <div
          className={`overlay ${this.state.mutedPeerIds.includes(p.id) ? 'visible' : ''}`}
          onMouseMove={this.handleOverlayHover}
          onTouchEnd={this.handleOverlayHover}
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
    const { windowColor } = this.props;

    return (
      <div
        className={this.state.inRoom ? 'inRoom' : 'wrapper'}
        ref={(e) => this.wrapper = e}
        >
        <div>
          <div
            className="vidContainer"
            style={{ borderColor: `rgba(${windowColor.r}, ${windowColor.g}, ${windowColor.b}, ${windowColor.a})` }}
            >
            <video
              // Important: The local video element needs to have a ref
              ref={(vid) => { this.localVid = vid; }}
              playsInline
              muted
            />
            <div
              className={`overlay ${this.state.muted || this.props.iOS ? 'visible' : ''}`}
              onMouseMove={this.handleOverlayHover}
              onTouchEnd={this.handleOverlayHover}
              ref={(el) => this.localOverlay = el}
              >
                <div className="overlayMiddle">
                  {
                    this.props.iOS &&
                    <IconButton
                      tooltip="Start Video"
                      onClick={this.handleVideoStart}
                      >
                        <i className="material-icons">video_call</i>
                    </IconButton>
                  }
                  {
                    !this.props.iOS &&
                    <IconButton
                      tooltip={this.state.muted ? 'Unmute' : 'Mute'}
                      onClick={this.handleSelfMute}
                      >
                        <i className="material-icons">{this.state.muted ? 'volume_off' : 'volume_up'}</i>
                    </IconButton>
                  }
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
