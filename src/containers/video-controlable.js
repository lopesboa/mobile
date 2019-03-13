// @flow

import * as React from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import orientation from 'react-native-orientation-locker';

import {ended, play} from '@coorpacademy/player-store';

import Video, {STEP} from '../components/video';
import type {Step} from '../components/video';
import {showNavigation, hideNavigation} from '../redux/actions/navigation';

type ConnectedDispatchToProps = {|
  showNavigation: typeof showNavigation,
  hideNavigation: typeof hideNavigation,
  play: typeof play,
  ended: typeof ended
|};

type Props = {|
  ...ConnectedDispatchToProps,
  source: File | {uri: string},
  preview: File | {uri: string},
  height: number,
  subtitles?: string,
  testID?: string
|};

type State = {|
  step: Step,
  isFullScreen: boolean,
  hasSubtitles: boolean
|};

class VideoControlable extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    step: STEP.PREVIEW,
    isFullScreen: false,
    hasSubtitles: true
  };

  videoPlayer: VideoPlayer;

  isReady: boolean = false;

  handleExpand = () => {
    if (this.videoPlayer) {
      this.videoPlayer.player.ref.presentFullscreenPlayer();
      orientation.lockToLandscape();
      this.setState({
        isFullScreen: true
      });
      if (Platform.OS === 'android') {
        this.props.hideNavigation();
      }
    }
  };

  handleShrink = () => {
    if (this.videoPlayer) {
      this.videoPlayer.player.ref.dismissFullscreenPlayer();
      orientation.unlockAllOrientations();
      this.setState({
        isFullScreen: false
      });
      if (Platform.OS === 'android') {
        this.props.showNavigation();
      }
    }
  };

  handlePlay = () => {
    this.isReady = false;
    if (this.videoPlayer) {
      this.videoPlayer.seekTo(0);
    }
    this.setState({
      step: STEP.PLAY
    });
    this.props.play();
  };

  handleEnd = () => {
    this.handleShrink();
    this.setState({
      step: STEP.END
    });
  };

  handleReady = () => {
    // This is a hack to launch the video
    if (Platform.OS === 'android' && this.videoPlayer && !this.isReady) {
      this.isReady = true;
      this.videoPlayer.seekTo(0);
    }
  };

  handleSubtitlesToggle = () =>
    this.setState(({hasSubtitles}: State) => ({
      hasSubtitles: !hasSubtitles
    }));

  handleRef = (videoPlayer: VideoPlayer | null) => {
    this.videoPlayer = videoPlayer;
  };

  render() {
    return (
      <Video
        source={this.props.source}
        preview={this.props.preview}
        height={this.props.height}
        step={this.state.step}
        subtitles={this.props.subtitles}
        hasSubtitles={this.state.hasSubtitles}
        isFullScreen={this.state.isFullScreen}
        onPlay={this.handlePlay}
        onEnd={this.handleEnd}
        onReady={this.handleReady}
        onExpand={this.handleExpand}
        onShrink={this.handleShrink}
        onSubtitlesToggle={this.handleSubtitlesToggle}
        onRef={this.handleRef}
        testID={this.props.testID}
      />
    );
  }
}

const mapDispatchToProps: ConnectedDispatchToProps = {
  showNavigation,
  hideNavigation,
  play,
  ended
};

export default connect(null, mapDispatchToProps)(VideoControlable);
