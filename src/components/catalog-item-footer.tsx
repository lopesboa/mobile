import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  NovaCompositionCoorpacademyAdaptive,
  NovaCompositionCoorpacademyTimer,
  NovaSolidStatusCheckCircle2
} from '@coorpacademy/nova-icons';

import {CONTENT_TYPE, AUTHOR_TYPE, SPACE} from '../const';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {getAuthor} from '../utils/content';
import theme from '../modules/theme';
import Text from './text';
import ProgressionBar from './progression-bar';
import Placeholder from './placeholder';
import PlaceholderLine, {
  LARGE_HEIGHT as PLACEHOLDER_LARGE_HEIGHT,
  BASE_HEIGHT as PLACEHOLDER_BASE_HEIGHT,
  SMALL_HEIGHT as PLACEHOLDER_SMALL_HEIGHT,
  TINY_HEIGHT as PLACEHOLDER_TINY_HEIGHT
} from './placeholder-line';
import Space from './space';

interface Props {
  item?: ChapterCard | DisciplineCard,
  testID: string,
  size?: 'cover' | 'hero'
};

export const PLACEHOLDER_COLOR = theme.colors.gray.lightMedium;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  icons: {
    flexDirection: 'row'
  },
  textCentered: {
    textAlign: 'center'
  },
  title: {
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  subtitle: {
    flex: 1,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.regular
  },
  progressionBar: {
    borderRadius: theme.radius.common,
    overflow: 'hidden'
  },
  progressionBarCentered: {
    width: '60%',
    alignSelf: 'center'
  },
  placeholder: {
    // @todo to be removed once we got a proper placeholder-line component
    height:
      PLACEHOLDER_BASE_HEIGHT +
      theme.spacing.tiny +
      PLACEHOLDER_BASE_HEIGHT +
      theme.spacing.base +
      PLACEHOLDER_SMALL_HEIGHT +
      theme.spacing.small +
      PLACEHOLDER_TINY_HEIGHT
  },
  placeholderHero: {
    // @todo to be removed once we got a proper placeholder-line component
    height:
      PLACEHOLDER_LARGE_HEIGHT +
      theme.spacing.tiny +
      PLACEHOLDER_LARGE_HEIGHT +
      theme.spacing.base +
      PLACEHOLDER_SMALL_HEIGHT +
      theme.spacing.small +
      PLACEHOLDER_TINY_HEIGHT
  }
});

const CatalogItemFooter = ({item, testID, size}: Props) => {
  const isHero = size === 'hero';

  if (!item) {
    return (
      <View style={styles.container} testID={`${testID}-placeholder`}>
        <Placeholder style={[styles.placeholder, isHero && styles.placeholderHero]}>
          <PlaceholderLine
            size={(isHero && 'large') || 'base'}
            width={(isHero && 85) || 65}
            color={PLACEHOLDER_COLOR}
            isCentered={isHero}
          />
          <Space type={SPACE.TINY} />
          <PlaceholderLine
            size={(isHero && 'large') || 'base'}
            width={(isHero && 65) || 90}
            color={PLACEHOLDER_COLOR}
            isCentered={isHero}
          />
          <Space type={SPACE.BASE} />
          <PlaceholderLine size="small" width={50} color={PLACEHOLDER_COLOR} isCentered={isHero} />
          <Space type={SPACE.SMALL} />
          <View style={[styles.progressionBar, isHero && styles.progressionBarCentered]}>
            <PlaceholderLine
              size="tiny"
              width={100}
              color={PLACEHOLDER_COLOR}
              isCentered={isHero}
            />
          </View>
        </Placeholder>
      </View>
    );
  }

  const titleFontSize =
    (size && (size === 'hero' ? theme.fontSize.xxlarge : theme.fontSize.xlarge)) ||
    theme.fontSize.regular;
  const subtitleFontSize = (size && theme.fontSize.regular) || theme.fontSize.small;
  const topIconSize = titleFontSize;
  const iconCertifiedSize = subtitleFontSize * 1.1;

  const author = getAuthor(item);
  const subtitle =
    item.authors &&
    item.authors
      .filter(({label}) => label)
      .map(({label}) => label)
      .join(', ');
  const titleStyle = {fontSize: titleFontSize};
  const subtitleStyle = {fontSize: subtitleFontSize};

  const itemCompletion = item.adaptiv && item.completion < 1 ? 0 : item.completion;

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.icons}>
        {!isHero && item.type === CONTENT_TYPE.CHAPTER ? (
          <React.Fragment>
            <NovaCompositionCoorpacademyTimer
              testID={`infinite-${testID}`}
              color={theme.colors.white}
              height={topIconSize}
              width={topIconSize}
            />
            <Space />
          </React.Fragment>
        ) : null}
        {!isHero && item.adaptiv ? (
          <NovaCompositionCoorpacademyAdaptive
            testID={`infinite-${testID}`}
            color={theme.colors.white}
            height={topIconSize}
            width={topIconSize}
          />
        ) : null}
      </View>
      <Space type="tiny" />
      <Text
        testID={`title-${testID}`}
        style={[styles.title, titleStyle, isHero && styles.textCentered]}
      >
        {item.title}
      </Text>
      {subtitle ? (
        <React.Fragment>
          <Space type="tiny" />
          <View style={styles.subtitleContainer}>
            <Text
              testID={`subtitle-${testID}`}
              style={[styles.subtitle, subtitleStyle, isHero && styles.textCentered]}
            >
              {subtitle}
            </Text>
            {author && author.authorType === AUTHOR_TYPE.VERIFIED && size !== 'hero' ? (
              <React.Fragment>
                <Space type="tiny" />
                <NovaSolidStatusCheckCircle2
                  testID={`certified-${testID}`}
                  color={theme.colors.white}
                  height={iconCertifiedSize}
                  width={iconCertifiedSize}
                />
              </React.Fragment>
            ) : null}
          </View>
        </React.Fragment>
      ) : null}
      <Space type="small" />
      <View
        style={[styles.progressionBar, isHero && styles.progressionBarCentered]}
        testID={`progress-bar-${testID}`}
      >
        <ProgressionBar
          current={itemCompletion}
          total={1}
          height={isHero ? 3 : 2}
          backgroundColor={theme.colors.white}
          isInnerRounded
        />
      </View>
    </View>
  );
};

export default CatalogItemFooter;
