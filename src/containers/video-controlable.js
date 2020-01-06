// @flow

import * as React from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {NavigationEvents} from 'react-navigation';
import {TextTrackType} from 'react-native-video';
import VideoPlayer from '@coorpacademy/react-native-video-controls';
import {
  fetchVideoUri,
  fetchVideoTracks,
  getVideoUri,
  getVideoTracks,
  VIDEO_TRACK_TYPE,
  VIDEO_TRACK_KIND
} from '@coorpacademy/player-store';
import type {VideoProvider} from '@coorpacademy/player-store';
import orientation from 'react-native-orientation-locker';
// @@todo wait for support tablet landscape orientation
// import DeviceInfo from 'react-native-device-info';

import Video, {STEP} from '../components/video';
import type {Props as ComponentProps, Step, Track} from '../components/video';
import {toggleFullscreen} from '../redux/actions/video/full-screen';
import {__STORYBOOK__} from '../modules/environment';
import {getMatchingLanguage} from '../modules/language';
import translations from '../translations';
import {VIDEO_PROVIDER} from '../layer/data/_const';
import {isVideoFullScreen, getBrandDefaultLanguage} from '../redux/utils/state-extract';

export type ConnectedStateProps = {|
  isFullScreen: boolean,
  source?: {uri: string},
  tracks?: Array<Track>,
  selectedTrack?: string
|};

type ConnectedDispatchToProps = {|
  toggleFullscreen: typeof toggleFullscreen,
  fetchVideoUri: typeof fetchVideoUri,
  fetchVideoTracks: typeof fetchVideoTracks
|};

type OwnProps = {|
  id: string,
  provider: VideoProvider,
  source?: {uri: string}
|};

type Props = {|
  ...ReactNavigation$ScreenProps,
  ...ConnectedStateProps,
  ...ConnectedDispatchToProps,
  ...ComponentProps,
  ...OwnProps
|};

type State = {|
  step: Step,
  hasTracks: boolean
|};

class VideoControlable extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    step: STEP.PREVIEW,
    hasTracks: true
  };

  videoPlayer: VideoPlayer;

  currentTime: number | void;

  isReady: boolean = false;

  handleExpand = async () => {
    if (this.videoPlayer) {
      await this.props.toggleFullscreen(true);

      this.videoPlayer.player.ref.presentFullscreenPlayer();
      if (Platform.OS === 'android' && this.currentTime) {
        this.videoPlayer.seekTo(this.currentTime);
      }

      orientation.unlockAllOrientations();
    }
  };

  handleShrink = async () => {
    if (this.videoPlayer) {
      await this.props.toggleFullscreen(false);

      this.videoPlayer.player.ref.dismissFullscreenPlayer();
      if (Platform.OS === 'android' && this.currentTime) {
        this.videoPlayer.seekTo(this.currentTime);
      }

      // @@todo wait for support tablet landscape orientation
      // if (!DeviceInfo.isTablet()) {
      orientation.lockToPortrait();
      // }
    }
  };

  handleProgress = ({currentTime}: {currentTime: number}) => {
    this.currentTime = currentTime;
  };

  handlePlay = async () => {
    const {id, provider} = this.props;

    this.isReady = false;

    if (this.videoPlayer) {
      this.videoPlayer.seekTo(0);
    }

    if (provider === VIDEO_PROVIDER.KONTIKI) {
      this.setState({
        step: STEP.LOADING
      });
      await this.props.fetchVideoUri(id, provider);
    }

    if (provider === VIDEO_PROVIDER.JWPLAYER) {
      await this.props.fetchVideoTracks(id, VIDEO_TRACK_TYPE.VTT);
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

  handleTracksToggle = () =>
    this.setState(({hasTracks}: State) => ({
      hasTracks: !hasTracks
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
    const {source, preview, height, tracks, selectedTrack, isFullScreen} = this.props;
    const {step, hasTracks} = this.state;

    return (
      <React.Fragment>
        {/*
        Should disable NavigationEvents when running Storybook because of rn navigation incompatibility
         */}
        {!__STORYBOOK__ ? <NavigationEvents onWillBlur={this.handleBlur} /> : null}
        <Video
          source={source}
          preview={preview}
          height={height}
          step={step}
          tracks={tracks}
          selectedTrack={hasTracks ? selectedTrack : undefined}
          isFullScreen={isFullScreen}
          onPlay={this.handlePlay}
          onEnd={this.handleEnd}
          onReady={this.handleReady}
          onExpand={this.handleExpand}
          onShrink={this.handleShrink}
          onProgress={this.handleProgress}
          onTracksToggle={this.handleTracksToggle}
          onRef={this.handleRef}
          onError={this.handleError}
          testID={this.props.testID}
          extralifeOverlay={this.props.extralifeOverlay}
        />
      </React.Fragment>
    );
  }
}

const _getVideoSource = (
  state: StoreState,
  {id, provider, source}: OwnProps
): {uri: string} | void => {
  const uri = getVideoUri(id)(state);

  return uri ? {uri} : source;
};

const _getVideoTracks = (state: StoreState, {id}: OwnProps): Array<Track> => {
  const tracks = getVideoTracks(id)(state) || [];

  return tracks
    .filter(({kind, label}) => kind === VIDEO_TRACK_KIND.CAPTIONS && label)
    .map(({label, file}) => ({
      // $FlowFixMe this is filtered above
      title: label,
      // $FlowFixMe this is filtered above
      language: label,
      type: TextTrackType.VTT,
      uri: file
    }));
};

const getIsFullScreenState: StoreState => boolean = createSelector(
  [isVideoFullScreen],
  isFullScreen => isFullScreen
);

const getVideoSourceState: (StoreState, OwnProps) => {uri: string} | void = createSelector(
  [_getVideoSource],
  source => source
);

const getVideoTracksState: (StoreState, OwnProps) => Array<Track> | void = createSelector(
  [_getVideoTracks],
  tracks => tracks
);

const getVideoSelectedTrackState: (StoreState, OwnProps) => string | void = createSelector(
  [_getVideoTracks, getBrandDefaultLanguage],
  (tracks, defaultLanguage) => {
    const languages = tracks.map(({language}) => language);
    const matchingLanguage =
      defaultLanguage &&
      getMatchingLanguage(languages, defaultLanguage, translations.getLanguage());
    const matchingTrack = tracks.find(({language}) => language === matchingLanguage);

    return matchingTrack ? matchingLanguage : undefined;
  }
);

export const mapStateToProps = (state: StoreState, props: OwnProps): ConnectedStateProps => ({
  source: getVideoSourceState(state, props),
  tracks: getVideoTracksState(state, props),
  selectedTrack: getVideoSelectedTrackState(state, props),
  isFullScreen: getIsFullScreenState(state)
});

const mapDispatchToProps: ConnectedDispatchToProps = {
  toggleFullscreen,
  fetchVideoUri,
  fetchVideoTracks
};

export {VideoControlable as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoControlable);
