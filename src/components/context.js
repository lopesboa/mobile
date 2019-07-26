// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {Media} from '@coorpacademy/progression-engine';

import theme from '../modules/theme';
import translations from '../translations';
import type {WithLayoutProps} from '../containers/with-layout';
import {getMediaUrl, getMediaPoster, getMediaType} from '../modules/media';
import Html from './html';
import Space from './space';
import Title from './question-title';
import Button from './button';
import Resource from './resource';

export type Props = $Exact<{|
  ...WithLayoutProps,
  header: string,
  description: string,
  onPress: () => void,
  onOpenBrowser: () => void,
  onPDFButtonPress: (url: string, description: string) => void,
  testID?: string,
  media?: Media
|}>;

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.base + theme.spacing.tiny,
    paddingBottom: theme.spacing.base,
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  text: {
    color: theme.colors.gray.dark,
    fontSize: theme.fontSize.large,
    textAlign: 'left'
  },
  image: {
    width: 200,
    height: 200,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  titleContainer: {
    paddingHorizontal: theme.spacing.base
  },
  content: {
    paddingHorizontal: theme.spacing.base
  },
  footer: {
    paddingHorizontal: theme.spacing.base
  }
});

class Context extends React.PureComponent<Props> {
  props: Props;

  handlePDFButtonPress = (url?: string, description?: string) => {
    const {onPDFButtonPress} = this.props;

    if (url && description) {
      onPDFButtonPress(url, description);
    }
  };

  render() {
    const {header, description, onPress, media, onOpenBrowser, testID} = this.props;

    // do not know why when pressing back button the render method here is called one more time even if
    // the media is not provided by the screen
    if (!media) {
      return null;
    }
    const url = getMediaUrl(media);
    const mediaType = getMediaType(media);

    if (!mediaType) {
      return null;
    }

    return (
      <View style={styles.container} testID={testID}>
        <View>
          <View style={styles.titleContainer}>
            <Title isTextCentered>{header}</Title>
          </View>
          <Space type="base" />
          <Resource
            testID={`context-resource-${mediaType}`}
            url={url}
            // $FlowFixMe incomplete media type
            videoId={media.videoId}
            mimeType={media.mimeType}
            onPress={this.handlePDFButtonPress}
            thumbnail={getMediaPoster(media)}
            description={media.description}
            type={mediaType}
          />
        </View>
        <Space type="base" />
        <View style={styles.content}>
          <Html
            fontSize={theme.fontSize.small}
            style={styles.text}
            imageStyle={styles.image}
            onLinkPress={onOpenBrowser}
            isTextCentered
          >
            {description}
          </Html>
        </View>
        <Space type="base" />

        <View style={styles.footer}>
          <Button
            onPress={onPress}
            testID="button-redirect-question"
            isSecondary
            analyticsID="button-redirect-question"
          >
            {translations.goToQuestion}
          </Button>
        </View>
      </View>
    );
  }
}

export default Context;
