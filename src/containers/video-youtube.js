// @flow

import * as React from 'react';
import RNYoutubePlayer from 'react-native-youtube';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import orientation from 'react-native-orientation-locker';
import type {StateChange} from '../components/video-youtube';
import type {Step} from '../components/video-overlay';
import PlayerComponent, {STATE} from '../components/video-youtube';
import {STEP} from '../components/video-overlay';
import {toggleFullscreen} from '../redux/actions/video/full-screen';
import {isVideoFullScreen} from '../redux/utils/state-extract';

export type ConnectedStateProps = {|
  isFullScreen: boolean
|};

type ConnectedDispatchToProps = {|
  toggleFullscreen: typeof toggleFullscreen
|};

type OwnProps = {|
  id: string,
  onPlay: () => Promise<void> | void,
  preview: File | {uri: string},
  height: number,
  testID?: string,
  extralifeOverlay?: boolean
|};

type Props = {|
  ...ConnectedStateProps,
  ...ConnectedDispatchToProps,
  ...OwnProps
|};

type State = {|
  step: Step
|};

class YoutubePlayer extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    step: STEP.PREVIEW
  };

  player: RNYoutubePlayer;

  handleRef = (player: RNYoutubePlayer) => {
    this.player = player;
  };

  handlePlay = () => {
    this.setState({
      step: STEP.PLAY
    });

    if (this.player) {
      this.player.seekTo(0);
    }

    this.props.onPlay();
  };

  handleError = () =>
    this.setState({
      step: STEP.ERROR
    });

  handleChangeFullScreen = async () => {
    await this.props.toggleFullscreen(!this.props.isFullScreen);
    orientation.unlockAllOrientations();
  };

  handleEnd = () => {
    orientation.lockToPortrait();
    this.setState({
      step: STEP.END
    });
  };

  handleOnChangeState = ({state}: StateChange) => {
    if (state === STATE.ENDED) {
      this.handleEnd();
    }
  };

  render() {
    const {id, preview, height, isFullScreen, extralifeOverlay, testID} = this.props;
    const {step} = this.state;
    return (
      <PlayerComponent
        id={id}
        preview={preview}
        height={height}
        step={step}
        isFullScreen={isFullScreen}
        onPlay={this.handlePlay}
        onError={this.handleError}
        onChangeState={this.handleOnChangeState}
        onRef={this.handleRef}
        onChangeFullscreen={this.handleChangeFullScreen}
        testID={testID}
        extralifeOverlay={extralifeOverlay}
      />
    );
  }
}

const getIsFullScreenState: StoreState => boolean = createSelector(
  [isVideoFullScreen],
  isFullScreen => isFullScreen
);

export const mapStateToProps = (state: StoreState, props: OwnProps): ConnectedStateProps => ({
  isFullScreen: getIsFullScreenState(state)
});

const mapDispatchToProps: ConnectedDispatchToProps = {
  toggleFullscreen
};

export {YoutubePlayer as Component};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YoutubePlayer);
