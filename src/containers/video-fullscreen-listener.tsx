import * as React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {WhitePortal} from 'react-native-portal';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9999,
  },
});

interface ConnectedStateProps {
  isFullScreen: boolean;
}

type Props = ConnectedStateProps;

function VideoFullscreenListener({isFullScreen}: Props) {
  if (!isFullScreen) {
    return null;
  }

  const childrenProps = {
    isFullscreen: true,
  };

  return (
    <React.Fragment>
      <WhitePortal name="video" style={styles.container} childrenProps={childrenProps} />
      <StatusBar hidden />
    </React.Fragment>
  );
}

const mapStateToProps = ({video}: StoreState): ConnectedStateProps => ({
  isFullScreen: video.isFullScreen,
});

export default connect(mapStateToProps)(VideoFullscreenListener);
