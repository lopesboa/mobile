// @flow

import * as React from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import {fetchVideoUri} from '@coorpacademy/player-store';
import type {VideoProvider} from '@coorpacademy/player-store';
import orientation from 'react-native-orientation-locker';
// @@todo wait for support tablet landscape orientation
// import DeviceInfo from 'react-native-device-info';

import Video, {STEP} from '../components/video';
import type {Step} from '../components/video';
import {toggleFullscreen} from '../redux/actions/video/full-screen';
import {__STORYBOOK__} from '../modules/environment';
import {VIDEO_PROVIDER} from '../layer/data/_const';

type ConnectedStateProps = {|
  isFullScreen: boolean,
  source?: {uri: string}
|};

type ConnectedDispatchToProps = {|
  toggleFullscreen: typeof toggleFullscreen,
  fetchVideoUri: typeof fetchVideoUri
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps,
  ...ConnectedDispatchToProps,
  source: File | {uri?: string},
  videoId: string,
  videoProvider: VideoProvider,
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

  play = async () => {
    const {videoId, videoProvider} = this.props;

    if (videoProvider === VIDEO_PROVIDER.KONTIKI) {
      this.setState({
        step: STEP.LOADING
      });
      await this.props.fetchVideoUri(videoId, videoProvider);
    }

    this.setState({
      step: STEP.PLAY
    });

    this.props.onPlay && this.props.onPlay();
  };

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

    this.play();
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

  handleError = () =>
    this.setState({
      step: STEP.ERROR
    });

  render() {
    return (
      <React.Fragment>
        {/*
        Should disable NavigationEvents when running  Storybook because of rn navigation incompatibility
         */}
        {!__STORYBOOK__ ? <NavigationEvents onWillBlur={this.handleBlur} /> : null}
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
          onError={this.handleError}
          testID={this.props.testID}
          extralifeOverlay={this.props.extralifeOverlay}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({video, data}: StoreState, {videoId}: Props): ConnectedStateProps => {
  const videoUrl = data.videos.entities[videoId];

  return {
    ...(videoUrl ? {source: {uri: videoUrl}} : {}),
    isFullScreen: video.isFullScreen
  };
};

const mapDispatchToProps: ConnectedDispatchToProps = {
  toggleFullscreen,
  fetchVideoUri
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoControlable);
