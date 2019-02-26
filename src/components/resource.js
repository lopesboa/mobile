// @flow

import * as React from 'react';
import {View} from 'react-native';

import {RESOURCE_TYPE} from '../const';
import type {ResourceType} from '../types';
import Video from '../containers/video-controlable';
import {getCleanUri} from '../modules/uri';
import Preview from './preview';

type Props = {|
  type: ResourceType,
  thumbnail: string,
  url: string,
  description: string,
  height: number,
  onPDFButtonPress: (url: string, description: string) => void
|};

class Resource extends React.PureComponent<Props> {
  props: Props;

  handlePress = () => {
    const {url, description, onPDFButtonPress} = this.props;
    onPDFButtonPress(getCleanUri(url), description);
  };

  render() {
    const {type, thumbnail, url, height} = this.props;

    switch (type) {
      case RESOURCE_TYPE.VIDEO: {
        return (
          <Video
            source={{uri: getCleanUri(url)}}
            preview={{uri: getCleanUri(thumbnail)}}
            height={height}
          />
        );
      }
      case RESOURCE_TYPE.PDF: {
        return (
          <View style={{height}}>
            <Preview
              type={RESOURCE_TYPE.PDF}
              source={{uri: getCleanUri(thumbnail)}}
              onPress={this.handlePress}
            />
          </View>
        );
      }
    }
  }
}

export default Resource;
