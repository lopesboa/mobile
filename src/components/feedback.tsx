import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {Media} from '../types/coorpacademy/progression-engine';

import theme from '../modules/theme';
import {getMediaUrl, getMediaPoster, getMediaType, isMediaSupported} from '../modules/media';
import Card from './card';
import Text from './text';
import Html from './html';
import Resource from './resource';
import Space from './space';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.tiny,
    paddingTop: theme.spacing.tiny,
  },
  media: {
    paddingBottom: theme.spacing.tiny,
  },
  content: {
    paddingTop: theme.spacing.tiny,
    paddingBottom: theme.spacing.small,
    paddingHorizontal: theme.spacing.tiny,
  },
  title: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
  },
});

interface Props {
  title?: string;
  description?: string;
  media?: Media;
  onPDFButtonPress: (url: string, description?: string) => void;
  onLinkPress: (url: string) => void;
  testID?: string;
}

class Feedback extends React.PureComponent<Props> {
  handlePDFButtonPress = (url?: string, description?: string) => {
    const {onPDFButtonPress} = this.props;

    if (url) {
      onPDFButtonPress(url, description);
    }
  };

  render() {
    const {title, description, media, onLinkPress, testID = 'feedback'} = this.props;

    const _isMediaSupported = media && isMediaSupported(media);

    if (!title && !description && !_isMediaSupported) {
      return null;
    }

    const mediaType = media ? getMediaType(media) : null;

    return (
      <Card testID={testID} style={styles.container}>
        {isMediaSupported && media && mediaType ? (
          <View style={styles.media}>
            <Card>
              <Resource
                testID={`${testID}-resource-${mediaType}`}
                url={getMediaUrl(media)}
                // @ts-ignore incomplete media type
                videoId={media.videoId}
                mimeType={media.mimeType}
                onPress={this.handlePDFButtonPress}
                thumbnail={getMediaPoster(media)}
                description={media.description}
                type={getMediaType(media)}
                resizeMode="cover"
              />
            </Card>
          </View>
        ) : null}
        {title || description ? (
          <View style={styles.content}>
            {title ? (
              <Text style={styles.title} testID={`${testID}-title`}>
                {title}
              </Text>
            ) : null}
            {description ? (
              <React.Fragment>
                {title ? <Space type="tiny" /> : null}
                <Html onLinkPress={onLinkPress} testID={`${testID}-description`}>
                  {description}
                </Html>
              </React.Fragment>
            ) : null}
          </View>
        ) : null}
      </Card>
    );
  }
}

export default Feedback;
