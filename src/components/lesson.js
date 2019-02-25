// @flow

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import type {Lesson as LessonType} from '../layer/data/_types';
import {RESOURCE_TYPE} from '../const';
import theme from '../modules/theme';
import Video from '../containers/video-controlable';
import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import {getCleanUri} from '../modules/uri';
import QuestionTitle from './question-title';
import Space from './space';
import Preview from './preview';

type Props = {|
  ...WithLayoutProps,
  header: string,
  resources: Array<LessonType>,
  onPDFButtonPress: (url: string, description: string) => void
|};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.base,
    flexGrow: 1
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.xlarge
  }
});

class Lesson extends React.PureComponent<Props> {
  props: Props;

  handlePDFButtonPress = (url: string, description: string) => () => {
    const {onPDFButtonPress} = this.props;

    onPDFButtonPress(url, description);
  };

  render() {
    const {layout, header, resources} = this.props;

    // @todo other US, iterate over resources
    const resourceVideo: LessonType = resources.filter(
      item => item.type === RESOURCE_TYPE.VIDEO
    )[0];
    const videoUrl = resourceVideo && resourceVideo.mediaUrl && getCleanUri(resourceVideo.mediaUrl);
    const videoPoster = resourceVideo && getCleanUri(resourceVideo.poster);

    const resourcePDF: LessonType = resources.filter(item => item.type === RESOURCE_TYPE.PDF)[0];
    const pdfUrl = resourcePDF && getCleanUri(resourcePDF.mediaUrl);
    const pdfPoster = resourcePDF && getCleanUri(resourcePDF.poster);
    const pdfDescription = resourcePDF && resourcePDF.description;

    const height = layout && layout.width / (16 / 9);

    return (
      <View testID="lesson" style={styles.container}>
        <View style={styles.questionContainer}>
          <QuestionTitle>{header}</QuestionTitle>
        </View>
        <Space type="base" />
        {videoUrl &&
          videoPoster &&
          height && <Video source={{uri: videoUrl}} preview={{uri: videoPoster}} height={height} />}
        <Space type="base" />
        {pdfPoster &&
          pdfUrl &&
          pdfDescription &&
          height && (
            <View style={{height}}>
              <Preview
                type={RESOURCE_TYPE.PDF}
                source={{uri: pdfPoster}}
                onPress={this.handlePDFButtonPress(pdfUrl, pdfDescription)}
              />
            </View>
          )}
      </View>
    );
  }
}

export {Lesson as Component};
export default withLayout(Lesson);
