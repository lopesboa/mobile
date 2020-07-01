import * as React from 'react';
import {Animated, StyleSheet} from 'react-native';
import QRCodeScannerBase from 'react-native-qrcode-scanner';
import type {Event} from 'react-native-qrcode-scanner';

export interface Props {
  hasPermission: boolean;
  onScan: (token?: string) => void;
  testID?: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
});

class QRCodeScanner extends React.PureComponent<Props> {
  handleRead = ({data}: Event) => {
    this.props.onScan(typeof data === 'string' ? data : undefined);
  };

  render() {
    const {hasPermission, testID} = this.props;

    return (
      <Animated.View style={[styles.container, styles.camera]} testID={testID}>
        {hasPermission ? (
          <QRCodeScannerBase
            fadeIn={false}
            onRead={this.handleRead}
            cameraStyle={styles.camera}
            cameraProps={{captureAudio: false}}
          />
        ) : null}
      </Animated.View>
    );
  }
}

export default QRCodeScanner;
