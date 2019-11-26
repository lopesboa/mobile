// @flow strict

import * as React from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  }
});

type Props = {|
  publicationId: string
  // onPlay: () => void,
  // onPause: () => void
|};

class VideoHotspots extends React.PureComponent<Props> {
  props: Props;

  ref: WebView | null;

  // play = () => {};
  // pause = () => {};

  postMessage = (data: Object) => {
    const message = JSON.stringify({
      ...data,
      isFromReactNative: true
    });

    console.log('@postMessage', data);
    this.ref && this.ref.injectJavaScript(`window.postMessage('${message}', "*"); void(0);`);
  };

  handleMessage = event => {
    console.log('handleWebViewMessage', event);
  };

  handleWebViewRef = (ref: WebView | null) => (this.ref = ref);

  handleLoadEnd = () => {
    const {publicationId} = this.props;
    this.postMessage({
      type: 'init',
      publicationId
    });
  }

  render() {
    return (
      <WebView
        ref={this.handleWebViewRef}
        source={require('../assets/html/adways.html')}
        scrollEnabled={false}
        onMessage={this.handleMessage}
        onLoadEnd={this.handleLoadEnd}
        style={styles.container}
      />
    );
  }
}

export default VideoHotspots;
