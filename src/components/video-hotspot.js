// @flow strict

import * as React from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import type {WebViewMessageEvent} from 'react-native-webview';

import {VIDEO_HOTSPOT_EVENT_NAME, VIDEO_HOTSPOT_EVENT_CALLBACK_NAME} from '../const';
import type {VideoHotspotEvent, VideoHotspotEventCallback} from '../types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  }
});

type Props = {|
  publicationId: string,
  onPlay?: () => void,
  onPause?: () => void,
  onSeekChange?: number => void,
  onVolumeChange?: number => void,
  onMutedChange?: boolean => void
|};

class VideoHotspot extends React.PureComponent<Props> {
  props: Props;

  webViewRef: WebView | null;

  postMessage = (data: VideoHotspotEventCallback) => {
    const message = JSON.stringify({
      ...data,
      isFromReactNative: true
    });

    // eslint-disable-next-line no-console
    console.debug('VideoHotspot', 'postMessage', message);

    this.webViewRef && this.webViewRef.injectJavaScript(`window.postMessage('${message}', "*");`);
  };

  /**
    The callbacks should trigger:
    - {name: "play"}
  */
  play = () => this.postMessage({name: VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.PLAY});

  /**
    The callbacks should trigger:
    - {name: "pause"}
  */
  pause = () => this.postMessage({name: VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.PAUSE});

  /**
    The callbacks should trigger:
   - {name: "apiready"}
  */
  setApiReady = () => this.postMessage({name: VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.API_READY});

  /**
    The callbacks should trigger:
    - {name: "loadedmetadata", value: {duration: float, time: float, width: integer, height: integer}}
  */
  loadMetadata = ({
    duration,
    time,
    width,
    height
  }: {
    duration: number,
    time: number,
    width: number,
    height: number
  }) =>
    this.postMessage({
      name: VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.LOADED_METADATA,
      value: {
        duration,
        time,
        width,
        height
      }
    });

  /**
    The callbacks should trigger:
    - {name: "timeupdate", value: float}
  */
  updateTime = ({value}: {value: number}) =>
    this.postMessage({name: VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.TIME_UPDATE, value});

  /**
    The callbacks should trigger:
    - {name: "volumechange", value: float}
  */
  setVolume = ({value}: {value: number}) =>
    this.postMessage({name: VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.VOLUME_CHANGE, value});

  /**
    The callbacks should trigger:
    - {name: "seeked", value: float}
  */
  seekTo = ({value}: {value: number}) =>
    this.postMessage({name: VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.SEEKED, value});

  /**
    The event can be one of the following:
      - {name: "play"}
      - {name: "pause"}
      - {name: "seek", value: float}
      - {name: "volume", value: integer}
      - {name: "muted", value: integer}
  */
  handleMessage = ({nativeEvent: {data}}: WebViewMessageEvent) => {
    const {onPlay, onPause, onSeekChange, onVolumeChange, onMutedChange} = this.props;

    // eslint-disable-next-line no-console
    console.debug('VideoHotspot', 'handleMessage', data);

    // $FlowFixMe mixed type
    const {name, value}: VideoHotspotEvent = JSON.parse(data);

    switch(name) {
      case VIDEO_HOTSPOT_EVENT_NAME.PLAY:
        onPlay && onPlay();
        break;
      case VIDEO_HOTSPOT_EVENT_NAME.PAUSE:
        onPause && onPause();
        break;
      case VIDEO_HOTSPOT_EVENT_NAME.SEEK:
        onSeekChange && onSeekChange(value);
        break;
      case VIDEO_HOTSPOT_EVENT_NAME.VOLUME:
        onVolumeChange && onVolumeChange(value);
        break;
      case VIDEO_HOTSPOT_EVENT_NAME.MUTED:
        onMutedChange && onMutedChange(Boolean(value));
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn(`Video hotspot event not implemented yet: ${data}`);
    }
  };

  handleWebViewRef = (ref: WebView | null) => (this.webViewRef = ref);

  handleLoadEnd = () => {
    const {publicationId} = this.props;

    this.postMessage({
      name: VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.INIT,
      value: {
        publicationId
      }
    });
  };

  render() {
    return (
      <WebView
        ref={this.handleWebViewRef}
        // https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#loading-local-html-files
        // $FlowFixMe bad type
        source={require('../assets/html/adways.html')}
        originWhitelist={['*']}
        scrollEnabled={false}
        onMessage={this.handleMessage}
        onLoadEnd={this.handleLoadEnd}
        style={styles.container}
      />
    );
  }
}

export default VideoHotspot;
