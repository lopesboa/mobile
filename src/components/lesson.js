// @flow

import * as React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import type {Lesson as LessonType} from '../layer/data/_types';
import {RESOURCE_TYPE} from '../const';
import theme from '../modules/theme';
import {getSubtitlesUri} from '../modules/subtitles';
import withLayout from '../containers/with-layout';
import translations from '../translations';
import type {WithLayoutProps} from '../containers/with-layout';
import Html from './html';
import QuestionTitle from './question-title';
import Resource from './resource';
import ResourcesBrowser from './resources-browser';
import Space from './space';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  ...WithLayoutProps,
  header: string,
  starsGranted: number,
  selected?: string,
  resources: Array<LessonType>,
  onChange: (id: string) => void,
  onPDFButtonPress: (url: string, description: string) => void
|};

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.base,
    flexGrow: 1
  },
  browser: {
    flex: 1
  },
  questionContainer: {
    paddingHorizontal: theme.spacing.base
  },
  bottomTextWrapper: {
    backgroundColor: theme.colors.gray.light,
    width: '100%',
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.xlarge
  },
  bottomText: {
    color: theme.colors.gray.dark,
    textAlign: 'center'
  }
});

const Lesson = (props: Props) => {
  const {layout, header, onChange, resources, selected, starsGranted} = props;

  const openedResource: LessonType = resources.filter(resource => resource._id === selected)[0];
  const height = layout && layout.width / (16 / 9);

  if (!height || !selected) {
    return null;
  }

  const winAdditionalStars = translations.winAdditionalStars.replace(
    /{{count}}/g,
    String(starsGranted)
  );

  return (
    <BrandThemeContext.Consumer>
      {brandTheme => {
        const subtitles =
          openedResource &&
          openedResource.subtitleRef &&
          // @todo use user language
          getSubtitlesUri(brandTheme.host, openedResource.subtitleRef, 'en');

        const resourceType = openedResource && openedResource.type;
        const resourcePoster = openedResource && openedResource.poster;
        const resourceDescription = openedResource && openedResource.description;
        const resourceMediaUrl = openedResource && openedResource.mediaUrl;
        const resourceDownloadUrl = openedResource && openedResource.downloadUrl;
        const url =
          // $FlowFixMe img is not defined in progression-engine
          (resourceType === RESOURCE_TYPE.VIDEO && resourceDownloadUrl) || resourceMediaUrl;

        return (
          <View testID="lesson" style={styles.container}>
            <View style={styles.questionContainer}>
              <QuestionTitle>{header}</QuestionTitle>
            </View>
            <Space type="base" />
            <Resource
              type={resourceType}
              url={url}
              description={resourceDescription}
              thumbnail={resourcePoster}
              subtitles={subtitles}
              height={height}
              onPDFButtonPress={props.onPDFButtonPress}
            />
            <ScrollView
              style={styles.browser}
              showsHorizontalScrollIndicator={false}
              testID="resources"
            >
              <ResourcesBrowser resources={resources} onChange={onChange} selected={selected} />
            </ScrollView>
            <View style={styles.bottomTextWrapper}>
              <Html testID="additional-stars-note" fontSize={12} style={styles.bottomText}>
                {winAdditionalStars}
              </Html>
            </View>
          </View>
        );
      }}
    </BrandThemeContext.Consumer>
  );
};

export {Lesson as Component};
export default withLayout(Lesson);
