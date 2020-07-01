import * as React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import type {LessonType} from '../types/coorpacademy/progression-engine';

import type {Resource as ResourceType} from '../types';
import theme from '../modules/theme';
import translations from '../translations';
import type {WithLayoutProps} from '../containers/with-layout';
import {RESOURCE_TYPE} from '../const';
import Html from './html';
import QuestionTitle from './question-title';
import Resource from './resource';
import ResourcesBrowser from './resources-browser';
import Space from './space';

interface Props extends WithLayoutProps {
  header: string;
  starsGranted: number;
  testID?: string;
  selected?: string;
  resources: Array<ResourceType>;
  onChange: (id: string) => void;
  onPDFButtonPress: (url: string, description?: string) => void;
  onVideoPlay: () => void;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.base + theme.spacing.tiny,
    flexGrow: 1,
  },
  browser: {
    flex: 1,
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.base,
  },
  bottomTextWrapper: {
    backgroundColor: theme.colors.gray.light,
    width: '100%',
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.base,
  },
  bottomText: {
    color: theme.colors.gray.dark,
    fontWeight: theme.fontWeight.bold,
  },
});

class Lesson extends React.Component<Props> {
  handlePress = (lessonType: LessonType) => (url?: string, description?: string) => {
    const {onPDFButtonPress, onVideoPlay} = this.props;

    if (lessonType === RESOURCE_TYPE.PDF && url) {
      return onPDFButtonPress(url, description);
    }

    return onVideoPlay();
  };

  render() {
    const {header, onChange, resources, selected, starsGranted, testID} = this.props;
    const openedResource = resources.find((resource) => resource._id === selected);

    if (!selected || !openedResource) {
      return null;
    }
    const winAdditionalStars = translations.winAdditionalStars.replace(
      /{{count}}/g,
      String(starsGranted),
    );

    return (
      <View testID={testID} style={styles.container}>
        <View style={styles.questionContainer}>
          <QuestionTitle isTextCentered>{header}</QuestionTitle>
        </View>
        <Space type="base" />
        <Resource
          testID="lesson-resource"
          type={openedResource.type}
          url={openedResource.url}
          videoId={openedResource.videoId}
          mimeType={openedResource.mimeType}
          description={openedResource.description}
          thumbnail={openedResource.poster}
          onPress={this.handlePress(openedResource.type)}
        />
        <ScrollView
          style={styles.browser}
          showsHorizontalScrollIndicator={false}
          testID="resources"
        >
          <ResourcesBrowser resources={resources} onChange={onChange} selected={selected} />
        </ScrollView>
        <View style={styles.bottomTextWrapper}>
          <Html
            testID="additional-stars-note"
            fontSize={theme.fontSize.small}
            style={styles.bottomText}
            isTextCentered
          >
            {winAdditionalStars}
          </Html>
        </View>
      </View>
    );
  }
}

export default Lesson;
