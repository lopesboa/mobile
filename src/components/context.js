// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {Media} from '@coorpacademy/progression-engine';
import theme from '../modules/theme';
import translations from '../translations';
// import type {Lesson as LessonType} from '../layer/data/_types';
import {RESOURCE_TYPE} from '../const';
import Video from '../containers/video-controlable';
import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import {getCleanUri} from '../modules/uri';
import Html from './html';
import Space from './space';
import Title from './question-title';
import Button from './button';
import Preview from './preview';
import Image from './image';

export type Props = {|
  ...WithLayoutProps,
  header: string,
  description: string,
  onPress: () => void,
  onOpenBrowser: () => void,
  onPDFButtonPress: (url: string, description: string) => void,
  testID?: string,
  mediaSources: Media
|};

const styles: GenericStyleProp = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.base,
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  text: {
    color: theme.colors.gray.dark,
    fontSize: 17,
    textAlign: 'left'
  },
  buttonText: {
    fontSize: 17
  },
  imageStyle: {
    width: 200,
    height: 200,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  titleContainer: {
    paddingHorizontal: theme.spacing.xlarge
  },
  descriptionContainer: {
    paddingHorizontal: theme.spacing.base
  },
  goToQuestionButton: {
    paddingHorizontal: theme.spacing.base
  }
});

class Context extends React.PureComponent<Props> {
  renderResource = (resource: Media) => {
    const {layout} = this.props;
    const height = layout && layout.width / (16 / 9);
    const width = layout && layout.width;
    const resourceType = resource && resource.type;
    switch (resourceType) {
      case RESOURCE_TYPE.PDF:
        return this.renderPdf(resource, height);
      case RESOURCE_TYPE.VIDEO:
        return this.renderVideo(resource, height);
      case RESOURCE_TYPE.IMG:
        return this.renderImage(resource, {height, width});
      default:
        return;
    }
  };

  handlePDFButtonPress = (url: string, description: string) => () => {
    const {onPDFButtonPress} = this.props;

    onPDFButtonPress(url, description);
  };

  renderPdf = (resource: Media, height?: number) => {
    const pdfUrl = resource.mediaUrl && getCleanUri(resource.mediaUrl);
    const pdfPoster = resource.mediaUrl && getCleanUri(resource.mediaUrl);
    const pdfDescription = resource.description;
    if (pdfUrl && pdfPoster && pdfDescription && height) {
      return (
        <View style={{height}}>
          <Preview
            type={RESOURCE_TYPE.PDF}
            source={{uri: pdfPoster}}
            onPress={this.handlePDFButtonPress(pdfUrl, pdfDescription)}
          />
        </View>
      );
    }
  };

  renderVideo = (resource: Media, height?: number) => {
    // $FlowFixMe
    const resourceVideo = resource && resource.src[0];
    const videoUrl = resourceVideo && resourceVideo.url && getCleanUri(resourceVideo.url);
    const videoPoster = resourceVideo && resourceVideo.url && getCleanUri(resourceVideo.url);

    if (videoUrl && videoPoster && height) {
      return <Video source={{uri: videoUrl}} preview={{uri: videoPoster}} height={height} />;
    }
  };

  renderImage = (resource: Media, {height, width}: {height?: number, width?: number}) => {
    // $FlowFixMe
    const url = getCleanUri(resource.src[0].url);
    return (
      // $FlowFixMe
      <Image source={{uri: url}} maxHeight={height} style={[styles.imageStyle, {height, width}]} />
    );
  };

  render() {
    const {header, description, onPress, mediaSources, onOpenBrowser, testID} = this.props;
    return (
      <View style={styles.container} testID={testID}>
        <View style={styles.titleContainer}>
          <Title>{header}</Title>
        </View>
        {this.renderResource(mediaSources)}
        <View style={styles.descriptionContainer}>
          <Html
            fontSize={12}
            style={styles.text}
            imageStyle={styles.imageStyle}
            onLinkPress={onOpenBrowser}
          >
            {description}
          </Html>
        </View>

        <Space type="base" />
        <View style={styles.goToQuestionButton}>
          <Button onPress={onPress} testID="goToQuestion-button" isSecondary>
            {translations.goToQuestion}
          </Button>
        </View>
      </View>
    );
  }
}

export {Context as Component};
export default withLayout(Context);
