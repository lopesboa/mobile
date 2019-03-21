// @flow

import * as React from 'react';
import {View} from 'react-native';
import type {LessonType} from '@coorpacademy/progression-engine';

import {RESOURCE_TYPE} from '../const';

import Video from '../containers/video-controlable';
import {getCleanUri} from '../modules/uri';
import Preview, {EXTRALIFE} from './preview';

type Props = {|
  type: LessonType | typeof EXTRALIFE,
  thumbnail: string,
  url: string,
  description: string,
  subtitles?: string,
  height: number,
  onPDFButtonPress: (url: string, description: string) => void,
  onVideoPlay: () => void,
  testID?: string,
  extralifeOverlay?: boolean
|};

class Resource extends React.PureComponent<Props> {
  props: Props;

  handlePress = () => {
    const {url, description, onPDFButtonPress} = this.props;
    onPDFButtonPress(getCleanUri(url), description);
  };

  handleVideoPlay = () => {
    this.props.onVideoPlay();
  };

  render() {
    const {type, thumbnail, url, subtitles, height, testID, extralifeOverlay = false} = this.props;

    switch (type) {
      case RESOURCE_TYPE.VIDEO: {
        return (
          <Video
            source={{uri: getCleanUri(url)}}
            subtitles={subtitles}
            preview={{uri: getCleanUri(thumbnail)}}
            height={height}
            testID={testID}
            extralifeOverlay={extralifeOverlay}
            onPlay={this.handleVideoPlay}
          />
        );
      }
      case RESOURCE_TYPE.PDF: {
        return (
          <View style={{height}}>
            <Preview
              type={extralifeOverlay ? EXTRALIFE : RESOURCE_TYPE.PDF}
              source={{uri: getCleanUri(thumbnail)}}
              onPress={this.handlePress}
              testID={testID}
            />
          </View>
        );
      }
      default:
        return null;
    }
  }
}

export default Resource;
