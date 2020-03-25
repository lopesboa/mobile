// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import type {LessonType} from '@coorpacademy/progression-engine';

import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import {RESOURCE_TYPE, VIDEO_PROVIDER_MIME_TYPE} from '../const';
import type {MimeType} from '../types';
import VideoControlable from '../containers/video-controlable';
import {getCleanUri} from '../modules/uri';
import {getVideoProvider} from '../modules/media';
import Preview, {EXTRALIFE} from './preview';
import ImageBackground from './image-background';
import {CONTAINER_STYLE as VIDEO_CONTAINER_STYLE} from './video';

type Props = {|
  ...WithLayoutProps,
  type: LessonType,
  url?: string,
  videoId?: string,
  mimeType?: MimeType,
  testID?: string,
  thumbnail?: string,
  description?: string,
  onPress?: (url?: string, description?: string) => void,
  style?: ViewStyleProp,
  resizeMode?: 'cover' | 'contain' | 'center' | 'repeat' | 'stretch',
  extralifeOverlay?: boolean
|};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  webviewLoader: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  }
});

class Resource extends React.PureComponent<Props> {
  props: Props;

  handlePress = () => {
    const {url, description, onPress} = this.props;

    onPress && url && onPress(getCleanUri(url), description);
  };

  renderWebviewPreview = () => {
    const {type, testID = 'resource', thumbnail} = this.props;

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
    const {
      type,
      url,
      videoId,
      mimeType,
      layout,
      testID,
      thumbnail = '',
      resizeMode = 'contain',
      extralifeOverlay = false,
      style
    } = this.props;

    if (!layout) {
      return null;
    }

    const height = layout.width / (16 / 9);

    switch (type) {
      case RESOURCE_TYPE.VIDEO: {
        if (mimeType === VIDEO_PROVIDER_MIME_TYPE.OMNIPLAYER) {
          return (
            <View style={[style, VIDEO_CONTAINER_STYLE, {height}]}>
              <WebView
                source={{uri: url && getCleanUri(url)}}
                originWhitelist={['*']}
                startInLoadingState
                useWebKit
                allowsInlineMediaPlayback
                style={styles.webview}
                renderLoading={this.renderWebviewPreview}
                testID={testID}
              />
            </View>
          );
        }

        return (
          <VideoControlable
            source={{uri: url && getCleanUri(url)}}
            id={videoId}
            provider={mimeType && getVideoProvider(mimeType)}
            testID={testID}
            preview={{uri: thumbnail && getCleanUri(thumbnail)}}
            height={height}
            extralifeOverlay={extralifeOverlay}
            style={style}
            onPlay={this.handlePress}
          />
        );
      }
      case RESOURCE_TYPE.PDF: {
        return (
          <View style={[style, {height}]}>
            <Preview
              testID={testID}
              type={extralifeOverlay ? EXTRALIFE : type}
              source={{uri: thumbnail && getCleanUri(thumbnail)}}
              onPress={this.handlePress}
            />
          </View>
        );
      }
      case RESOURCE_TYPE.IMG: {
        return (
          <ImageBackground
            testID={testID}
            source={{uri: url && getCleanUri(url)}}
            resizeMode={resizeMode}
            style={{
              ...style,
              height: (style && style.height) || height, // it was too risky to refactor this so here we cover every possible case
              width: layout && layout.width
            }}
          />
        );
      }
      default:
        return null;
    }
  }
}
export {Resource as Component};
export default withLayout(Resource);
