// @flow strict
/* eslint import/max-dependencies: 0 */

import * as React from 'react';
import {NovaSolidPlacesPlacesHome2 as HomeIcon} from '@coorpacademy/nova-icons';
import {View, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ConfettiCannon from 'react-native-confetti-cannon';

import translations from '../translations';
import {getCleanUri} from '../modules/uri';
import {CARD_DISPLAY_MODE, AUTHOR_TYPE, ENGINE} from '../const';
import theme, {defaultHitSlop} from '../modules/theme';
import type {ChapterCard, DisciplineCard} from '../layer/data/_types';
import {CARD_TYPE} from '../layer/data/_const';
import ButtonSticky from './button-sticky';
import {STYLE as BOX_STYLE} from './box';
import Card, {LAYOUT as CARD_LAYOUT} from './card';
import {getAuthorType, getAuthorName} from './catalog';
import CatalogItem from './catalog-item';
import Starburst from './starburst';
import HeartBroken from './heart-broken';
import Trophy from './trophy';
import {HEIGHT as BUTTON_HEIGHT} from './button';
import Text from './text';
import Space from './space';
import {BrandThemeContext} from './brand-theme-provider';
import Tooltip from './tooltip';
import Touchable from './touchable';

type Props = {|
  isSuccess: boolean,
  onButtonPress: () => void,
  onCardPress: (item: DisciplineCard | ChapterCard) => void,
  onClose: () => void,
  isLevelUnlocked: boolean,
  isFocused: boolean,
  bestScore: string,
  isLevelUnlocked: boolean,
  levelUnlockedName: string,
  hasFinishedCourse: boolean,
  recommendation: DisciplineCard | ChapterCard
|};

const PADDING_WIDTH = theme.spacing.base;
export const POSITIVE_COLOR = theme.colors.positive;
export const NEGATIVE_COLOR = theme.colors.negative;

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: BUTTON_HEIGHT + theme.spacing.base * 2
  },
  content: {
    paddingHorizontal: PADDING_WIDTH,
    paddingBottom: PADDING_WIDTH
  },
  starburst: {
    position: 'absolute'
  },
  starburstSpiral: {
    top: '-10%'
  },
  positive: {
    backgroundColor: theme.colors.positive
  },
  negative: {
    backgroundColor: theme.colors.negative
  },
  close: {
    height: 20,
    width: 20,
    marginBottom: theme.spacing.base,
    paddingTop: getStatusBarHeight(),
    paddingLeft: theme.spacing.base
  },
  mainHeader: {
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold
  },
  subHeader: {
    fontSize: theme.fontSize.large,
    color: theme.colors.white
  },
  header: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING_WIDTH
  },
  card: {
    borderRadius: theme.radius.card,
    minHeight: 1,
    overflow: 'hidden'
  },
  text: {
    fontSize: theme.fontSize.large,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold
  },
  title: {
    fontSize: theme.fontSize.large,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
    paddingBottom: theme.spacing.small,
    paddingTop: theme.spacing.base
  },
  recommendation: {
    flex: 1,
    borderRadius: theme.radius.card
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: PADDING_WIDTH
  },
  iconWrapper: {
    ...BOX_STYLE,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.button,
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.spacing.large,
    width: theme.spacing.large
  },
  icons: {
    width: theme.spacing.base,
    height: theme.spacing.base,
    color: theme.colors.positive
  },
  icon: {
    marginTop: -theme.spacing.base,
    marginBottom: -theme.spacing.xlarge
  },
  separator: {
    ...BOX_STYLE,
    width: theme.spacing.micro - 2,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.medium,
    height: '100%',
    borderWidth: 1
  },
  confettisContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
});

const {width: screenWidth} = Dimensions.get('window');

class LevelEnd extends React.PureComponent<Props> {
  handleCardPress = (item: DisciplineCard | ChapterCard) => () => this.props.onCardPress(item);

  handleButtonPress = () => this.props.onButtonPress();

  render() {
    const {
      isSuccess,
      bestScore,
      onClose,
      isLevelUnlocked,
      levelUnlockedName,
      hasFinishedCourse,
      recommendation,
      isFocused
    } = this.props;

    const header = (isSuccess && translations.congratulations) || translations.ooops;
    const backgroundColor = (isSuccess && styles.positive) || styles.negative;
    const bestScoreTranslation = translations.highscore.replace(/{{score}}/g, bestScore);
    const unlockNextLevelTranslation = translations.unlockNextLevel.replace(
      /{{levelName}}/g,
      levelUnlockedName
    );
    const buttonTranslation =
      (isSuccess && hasFinishedCourse && translations.backToHome) ||
      (isSuccess && translations.nextLevel) ||
      translations.retryLevel;

    return (
      <BrandThemeContext.Consumer>
        {brandTheme => (
          <View style={styles.globalContainer}>
            <ScrollView>
              <View
                style={[styles.container, backgroundColor]}
                testID={`level-end-${isSuccess ? 'success' : 'error'}`}
              >
                <Starburst
                  style={styles.starburst}
                  spiralStyle={styles.starburstSpiral}
                  spiralColor="rgba(0,0,0,0.06)"
                  backgroundColor={isSuccess ? theme.colors.positive : theme.colors.negative}
                />
                <View style={styles.close}>
                  <Touchable
                    testID="button-close"
                    onPress={onClose}
                    hitSlop={defaultHitSlop}
                    analyticsID="button-close"
                  >
                    <HomeIcon height={16} width={16} color={theme.colors.white} />
                  </Touchable>
                </View>
                <View style={styles.header}>
                  <Text style={styles.mainHeader} testID="level-end-header">
                    {header}
                  </Text>
                  {!isSuccess && (
                    <Text style={styles.subHeader} testID="level-end-subtitle">
                      {translations.outOfLives}
                    </Text>
                  )}
                </View>
                {isSuccess ? (
                  <Trophy style={[styles.icon, {height: screenWidth}]} />
                ) : (
                  <HeartBroken style={[styles.icon, {height: screenWidth}]} />
                )}
                <Space type="base" />
                <View style={styles.content}>
                  {isSuccess && (
                    <View>
                      {bestScore !== '0' && (
                        <Tooltip type="highscore" text={bestScoreTranslation} />
                      )}
                      <Space type="tiny" />
                      {isLevelUnlocked && (
                        <Tooltip type="unlock" text={unlockNextLevelTranslation} />
                      )}
                    </View>
                  )}
                  {recommendation && (
                    <View style={styles.recommendation}>
                      <Text style={styles.title}>{translations.relatedSubjects}</Text>
                      <Card type={CARD_LAYOUT.CONTAIN} style={styles.card} shadowStyle={BOX_STYLE}>
                        <CatalogItem
                          title={recommendation.title}
                          subtitle={recommendation.authors.map(author => author.label).join(', ')}
                          progression={{
                            current: recommendation.completion,
                            count: 1
                          }}
                          image={{uri: getCleanUri(recommendation.image)}}
                          authorType={getAuthorType(recommendation)}
                          authorName={
                            getAuthorType(recommendation) !== AUTHOR_TYPE.CUSTOM
                              ? getAuthorName(recommendation)
                              : brandTheme.name
                          }
                          badge={recommendation.isNew ? translations.new : ''}
                          isAdaptive={recommendation.adaptiv}
                          displayMode={CARD_DISPLAY_MODE.CARD}
                          onPress={this.handleCardPress(recommendation)}
                          testID={`recommend-item-${recommendation.universalRef.replace(
                            /_/g,
                            '-'
                          )}`}
                          isCertified={getAuthorType(recommendation) === AUTHOR_TYPE.VERIFIED}
                          universalRef={recommendation.universalRef}
                          type={
                            recommendation.type === CARD_TYPE.CHAPTER
                              ? ENGINE.MICROLEARNING
                              : ENGINE.LEARNER
                          }
                          section="recommendation"
                        />
                      </Card>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
            {isFocused && isSuccess && bestScore !== '0' && (
              <View pointerEvents="none" style={styles.confettisContainer}>
                <ConfettiCannon
                  count={100}
                  origin={{x: screenWidth / 2, y: 0}}
                  fadeOut
                  explosionSpeed={900}
                />
              </View>
            )}
            <ButtonSticky
              onPress={this.handleButtonPress}
              testID={`button-${isSuccess ? 'next' : 'retry'}-level`}
            >
              {buttonTranslation}
            </ButtonSticky>
          </View>
        )}
      </BrandThemeContext.Consumer>
    );
  }
}

export default LevelEnd;
