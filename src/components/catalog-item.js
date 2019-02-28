// @flow

import * as React from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';
import type {Progression, CardDisplayMode} from '../types';
import {CARD_DISPLAY_MODE} from '../const';
import theme from '../modules/theme';
import type {Chapter, Discipline} from '../layer/data/_types';
import CatalogItemFooter from './catalog-item-footer';
import Badge from './catalog-item-badge';
import ImageGradient from './image-gradient';
import CatalogItemAuthor from './catalog-item-author';

export type Item = Discipline | Chapter;

type Props = {|
  title: string,
  subtitle: string,
  progression?: Progression,
  onPress: (item: Item) => void,
  image: File | {uri: string},
  badge?: string,
  authorType?: string,
  isAdaptive: boolean,
  isCertified?: boolean,
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
  isCertified,
  displayMode,
  testID
}: Props) => {
  const mode: CardDisplayMode = displayMode ? displayMode : CARD_DISPLAY_MODE.COVER;

  const styles = StyleSheet.create({
    container: {
      minHeight: 205,
      padding: theme.spacing.small
    },
    title: {
      fontSize: 16
    },
    subtitle: {
      fontSize: 14
    },
    author: {
      fontSize: 8
    },
    badge: {
      minWidth: 40,
      minHeight: 17
    },
    badgeLabel: {
      fontSize: 8
    },
    containerCover: {
      minHeight: 265,
      padding: theme.spacing.base
    },
    titleCover: {
      fontSize: 22
    },
    subtitleCover: {
      fontSize: 16
    },
    authorCover: {
      fontSize: 12
    },
    badgeCover: {
      minWidth: 45,
      minHeight: 20
    },
    badgeLabelCover: {
      fontSize: 11
    }
  });

  const badgeLabel =
    badge && badge !== '' ? badge.charAt(0).toUpperCase() + badge.slice(1) : undefined;

  return (
    <TouchableHighlight testID={testID} onPress={onPress}>
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
        {authorType && (
          <CatalogItemAuthor
            authorType={authorType}
            style={mode === CARD_DISPLAY_MODE.CARD ? styles.author : styles.authorCover}
            testID={testID}
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
    </TouchableHighlight>
  );
};

export default CatalogItem;
