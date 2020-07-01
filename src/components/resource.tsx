import * as React from 'react';
import {View, ViewStyle} from 'react-native';
import type {LessonType, ResourceMimeType} from '../types/coorpacademy/progression-engine';

import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import {RESOURCE_TYPE} from '../const';
import {getCleanUri} from '../modules/uri';
import {getVideoProvider} from '../modules/media';
import ResourceVideo from './resource-video';
import Preview, {EXTRALIFE} from './preview';
import ImageBackground from './image-background';

interface Props extends WithLayoutProps {
  type: LessonType;
  url?: string;
  videoId?: string;
  mimeType?: ResourceMimeType;
  testID?: string;
  thumbnail?: string;
  description?: string;
  onPress?: (url?: string, description?: string) => void;
  style?: ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'center' | 'repeat' | 'stretch';
  extralifeOverlay?: boolean;
}

class Resource extends React.PureComponent<Props> {
  handlePress = () => {
    const {url, description, onPress} = this.props;

    onPress && url && onPress(getCleanUri(url), description);
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
      style,
    } = this.props;

    if (!layout) {
      return null;
    }

    const height = layout.width / (16 / 9);

    switch (type) {
      case RESOURCE_TYPE.VIDEO: {
        const provider = mimeType && getVideoProvider(mimeType);
        const preview = thumbnail && getCleanUri(thumbnail);
        const source = url && getCleanUri(url);

        if (!provider || !source) return null;

        return (
          <ResourceVideo
            id={videoId}
            source={{uri: source}}
            onPlay={this.handlePress}
            provider={provider}
            preview={{uri: preview}}
            height={height}
            extralifeOverlay={extralifeOverlay}
            testID={testID}
            type={type}
            thumbnail={thumbnail}
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
              width: layout && layout.width,
            }}
          />
        );
      }
      default: {
        return null;
      }
    }
  }
}
export {Resource as Component};
export default withLayout(Resource);
