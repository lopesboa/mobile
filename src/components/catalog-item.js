// @flow

import * as React from 'react';
import {StyleSheet, TouchableHighlight, Dimensions, View} from 'react-native';
import type {Progression, CardDisplayMode, AuthorType} from '../types';
import {CARD_DISPLAY_MODE} from '../const';
import theme from '../modules/theme';
import type {Chapter, Discipline} from '../layer/data/_types';
import CatalogItemFooter from './catalog-item-footer';
import Badge from './catalog-item-badge';
import ImageGradient from './image-gradient';
import CatalogItemAuthor from './catalog-item-author';

export type Item = Discipline | Chapter;

export type CourseInfo = {|
  title: string,
  subtitle: string,
  progression?: Progression,
  image: File | {uri: string},
  badge?: string,
  authorType?: AuthorType,
  authorName?: string,
  isAdaptive: boolean,
  isCertified?: boolean
|};
type Props = {|
  ...CourseInfo,
  onPress: (item: Item) => void,
  displayMode?: CardDisplayMode,
  testID: string
|};

const CatalogItem = ({
  onPress,
  title,
  subtitle,
  progression,
  image,
  badge,
  isAdaptive,
  authorType,
  authorName,
  isCertified,
  displayMode,
  testID
}: Props) => {
  const mode: CardDisplayMode = displayMode ? displayMode : CARD_DISPLAY_MODE.COVER;
  const screenHeight: number = Dimensions.get('window').height;

  const styles = StyleSheet.create({
    container: {
      minHeight: 205,
      padding: theme.spacing.small
    },
    title: {
      fontSize: theme.fontSize.regular
    },
    subtitle: {
      fontSize: theme.fontSize.small
    },
    author: {
      fontSize: theme.fontSize.extraSmall,
      letterSpacing: 1.88
    },
    badge: {
      minWidth: 40,
      minHeight: 17
    },
    badgeLabel: {
      fontWeight: theme.fontWeight.bold,
      fontSize: theme.fontSize.extraSmall
    },
    containerCover: {
      minHeight: 215,
      height: screenHeight * 0.3,
      padding: theme.spacing.base
    },
    titleCover: {
      fontSize: theme.fontSize.extraLarge
    },
    subtitleCover: {
      fontSize: theme.fontSize.regular
    },
    authorCover: {
      fontSize: theme.fontSize.small,
      letterSpacing: 2.25
    },
    badgeCover: {
      minWidth: 45,
      minHeight: 20
    },
    badgeLabelCover: {
      fontWeight: theme.fontWeight.bold,
      fontSize: theme.fontSize.small
    }
  });

  const badgeLabel =
    badge && badge !== '' ? badge.charAt(0).toUpperCase() + badge.slice(1) : undefined;

  return (
    <TouchableHighlight testID={testID} onPress={onPress}>
      <View>
        <ImageGradient
          testID={testID}
          image={image}
          style={mode === CARD_DISPLAY_MODE.CARD ? styles.container : styles.containerCover}
        >
          {badgeLabel && (
            <Badge
              label={badgeLabel}
              style={mode === CARD_DISPLAY_MODE.CARD ? styles.badge : styles.badgeCover}
              labelStyle={
                mode === CARD_DISPLAY_MODE.CARD ? styles.badgeLabel : styles.badgeLabelCover
              }
              testID={`badge-${testID}`}
            />
          )}

          <CatalogItemFooter
            title={title}
            subtitle={subtitle}
            isCertified={isCertified}
            isAdaptive={isAdaptive}
            progression={progression}
            titleStyle={mode === CARD_DISPLAY_MODE.CARD ? styles.title : styles.titleCover}
            subtitleStyle={mode === CARD_DISPLAY_MODE.CARD ? styles.subtitle : styles.subtitleCover}
            iconAdaptiveSize={mode === CARD_DISPLAY_MODE.CARD ? 16 : 22}
            iconCertifiedSize={mode === CARD_DISPLAY_MODE.CARD ? 14 : 16}
            testID={testID}
          />
        </ImageGradient>
        {authorType && (
          <CatalogItemAuthor
            authorType={authorType}
            style={mode === CARD_DISPLAY_MODE.CARD ? styles.author : styles.authorCover}
            authorName={authorName ? authorName : ''}
            testID={testID}
          />
        )}
      </View>
    </TouchableHighlight>
  );
};

export default CatalogItem;
