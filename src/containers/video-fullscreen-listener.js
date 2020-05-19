// @flow

import * as React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {WhitePortal} from 'react-native-portal';
import {BackHandler} from '../modules/back-handler';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9999
  }
});

type ConnectedStateProps = {|
  isFullScreen: boolean
|};

type Props = {|
  ...ConnectedStateProps
|};

class VideoFullscreenListener extends React.PureComponent<Props> {
  props: Props;

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = (): boolean => true;

  render() {
    const {isFullScreen} = this.props;

    if (!isFullScreen) {
      return null;
    }

    const childrenProps = {
      isFullscreen: true
    };

    return (
      <React.Fragment>
        <WhitePortal name="video" style={styles.container} childrenProps={childrenProps} />
        <StatusBar hidden />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({video}: StoreState): ConnectedStateProps => ({
  isFullScreen: video.isFullScreen
});

export default connect(mapStateToProps)(VideoFullscreenListener);
