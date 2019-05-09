// @flow

import * as React from 'react';
import {Animated, StyleSheet} from 'react-native';
import QRCodeScannerBase from 'react-native-qrcode-scanner';
import type {Event} from 'react-native-qrcode-scanner';

export type Props = {|
  hasPermission: boolean,
  onScan: (token?: string) => void
|};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black'
  },
  camera: {
    width: '100%',
    height: '100%'
  }
});

class QRCodeScanner extends React.PureComponent<Props> {
  props: Props;

  handleRead = ({data}: Event) => {
    this.props.onScan(typeof data === 'string' ? data : undefined);
  };

  render() {
    const {hasPermission} = this.props;

    return (
      <Animated.View style={[styles.container, styles.camera]} testID="qr-code-scanner">
        {hasPermission && (
          <QRCodeScannerBase
            onRead={this.handleRead}
            cameraStyle={styles.camera}
            cameraProps={{captureAudio: false}}
          />
        )}
      </Animated.View>
    );
  }
}

export default QRCodeScanner;
