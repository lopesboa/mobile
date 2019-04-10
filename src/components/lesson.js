// @flow strict

import * as React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import type {Resource as ResourceType} from '../types';

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

type Props = $Exact<{|
  ...WithLayoutProps,
  header: string,
  starsGranted: number,
  selected?: string,
  resources: Array<ResourceType>,
  onChange: (id: string) => void,
  onPDFButtonPress: (url: string, description: string) => void,
  onVideoPlay: () => void
|}>;

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.base + theme.spacing.tiny,
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
    paddingHorizontal: theme.spacing.base
  },
  bottomText: {
    color: theme.colors.gray.dark
  }
});

const Lesson = ({
  layout,
  header,
  onChange,
  resources,
  selected,
  starsGranted,
  onPDFButtonPress,
  onVideoPlay
}: Props) => {
  const openedResource = resources.find(resource => resource._id === selected);
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
          getSubtitlesUri(brandTheme.host, openedResource.subtitleRef, translations.getLanguage());

        return (
          <View testID="lesson" style={styles.container}>
            <View style={styles.questionContainer}>
              <QuestionTitle isTextCentered>{header}</QuestionTitle>
            </View>
            <Space type="base" />
            {openedResource && (
              <Resource
                type={openedResource && openedResource.type}
                url={openedResource && openedResource.url}
                description={openedResource && openedResource.description}
                thumbnail={openedResource && openedResource.poster}
                subtitles={subtitles}
                height={height}
                onPDFButtonPress={onPDFButtonPress}
                onVideoPlay={onVideoPlay}
              />
            )}
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
      }}
    </BrandThemeContext.Consumer>
  );
};

export {Lesson as Component};
export default withLayout(Lesson);
