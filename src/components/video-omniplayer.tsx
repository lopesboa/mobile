import * as React from 'react';
import {View, ViewStyle, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import type {LessonType} from '../types/coorpacademy/progression-engine';
import {getCleanUri} from '../modules/uri';
import theme from '../modules/theme';
import Preview from './preview';

export const EXTRALIFE = 'extralife';

export interface Props {
  type: LessonType | typeof EXTRALIFE;
  source: File | {uri: string};
  thumbnail?: string;
  style?: ViewStyle;
  height: number;
  testID?: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.black,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webviewLoader: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});

class VideoOmniPlayer extends React.PureComponent<Props> {
  renderWebviewPreview = () => {
    const {type, testID = 'video-omniplayer', thumbnail} = this.props;

    return (
      <Preview
        type={type}
        source={{uri: thumbnail ? getCleanUri(thumbnail) : ''}}
        isLoading
        testID={`${testID}-webview-preview`}
        style={styles.webviewLoader}
      />
    );
  };

  render() {
    const {height, style, source, testID = 'video-omniplayer'} = this.props;
    return (
      <View style={[style, styles.container, {height}]}>
        <WebView
          // @ts-ignore
          source={source}
          originWhitelist={['*']}
          startInLoadingState
          useWebKit
          allowsInlineMediaPlayback
          style={styles.webview}
          renderLoading={this.renderWebviewPreview}
          testID={`${testID}-webview-video`}
        />
      </View>
    );
  }
}

export default VideoOmniPlayer;
