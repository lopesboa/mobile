// @flow

import * as React from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import orientation from 'react-native-orientation-locker';
// @@todo wait for support tablet landscape orientation
// import DeviceInfo from 'react-native-device-info';

import Video, {STEP} from '../components/video';
import type {Step} from '../components/video';
import {toggleFullscreen} from '../redux/actions/video';

type ConnectedStateProps = {|
  isFullScreen: boolean
|};

type ConnectedDispatchToProps = {|
  toggleFullscreen: typeof toggleFullscreen
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps,
  ...ConnectedDispatchToProps,
  source: File | {uri: string},
  preview: File | {uri: string},
  height: number,
  subtitles?: string,
  testID?: string,
  extralifeOverlay?: boolean,
  onPlay?: () => void
|};

type State = {|
  step: Step,
  hasSubtitles: boolean,
  currentTime?: number
|};

class VideoControlable extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    step: STEP.PREVIEW,
    hasSubtitles: true
  };

  videoPlayer: VideoPlayer;

  isReady: boolean = false;

  handleExpand = async () => {
    if (this.videoPlayer) {
      const {currentTime} = this.state;
      await this.props.toggleFullscreen(true);

      this.videoPlayer.player.ref.presentFullscreenPlayer();
      if (Platform.OS === 'android' && currentTime) {
        this.videoPlayer.seekTo(currentTime);
      }

      orientation.unlockAllOrientations();
    }
  };

  handleShrink = async () => {
    if (this.videoPlayer) {
      const {currentTime} = this.state;
      await this.props.toggleFullscreen(false);

      this.videoPlayer.player.ref.dismissFullscreenPlayer();
      if (Platform.OS === 'android' && currentTime) {
        this.videoPlayer.seekTo(currentTime);
      }

      // @@todo wait for support tablet landscape orientation
      // if (!DeviceInfo.isTablet()) {
      orientation.lockToPortrait();
      // }
    }
  };

  handleProgress = (data: {currentTime: number} | void) =>
    this.setState({
      currentTime: data && data.currentTime
    });

  handlePlay = () => {
    this.isReady = false;
    if (this.videoPlayer) {
      this.videoPlayer.seekTo(0);
    }
    this.setState({
      step: STEP.PLAY
    });

    this.props.onPlay && this.props.onPlay();
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

  handleBlur = () => this.videoPlayer && this.videoPlayer.methods.pause();

  render() {
    return (
      <React.Fragment>
        <NavigationEvents onWillBlur={this.handleBlur} />
        <Video
          source={this.props.source}
          preview={this.props.preview}
          height={this.props.height}
          step={this.state.step}
          subtitles={this.props.subtitles}
          hasSubtitles={this.state.hasSubtitles}
          isFullScreen={this.props.isFullScreen}
          onPlay={this.handlePlay}
          onEnd={this.handleEnd}
          onReady={this.handleReady}
          onExpand={this.handleExpand}
          onShrink={this.handleShrink}
          onProgress={this.handleProgress}
          onSubtitlesToggle={this.handleSubtitlesToggle}
          onRef={this.handleRef}
          testID={this.props.testID}
          extralifeOverlay={this.props.extralifeOverlay}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({video}: StoreState): ConnectedStateProps => ({
  isFullScreen: video.isFullScreen
});

const mapDispatchToProps: ConnectedDispatchToProps = {
  toggleFullscreen
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoControlable);
