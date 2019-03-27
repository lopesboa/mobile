// @flow strict
/* eslint import/max-dependencies: 0 */

import * as React from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {NovaSolidStatusClose as CloseIcon} from '@coorpacademy/nova-icons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import translations from '../translations';
import {getCleanUri} from '../modules/uri';
import {CARD_DISPLAY_MODE, AUTHOR_TYPE} from '../const';
import theme, {defaultHitSlop} from '../modules/theme';
import type {ChapterCard, DisciplineCard} from '../layer/data/_types';
import ButtonSticky from '../containers/button-sticky';
import {STYLE as BOX_STYLE} from './box';
import Card, {CARD_TYPE} from './card';
import {getAuthorType, getAuthorName} from './catalog';

import CatalogItem from './catalog-item';
import Starburst from './starburst';
import HeartBroken from './heart-broken';
import Trophy from './trophy';
import {HEIGHT as BUTTON_HEIGHT} from './button';
import Text from './text';
import Space from './space';
import {BrandThemeContext} from './brand-theme-provider';

type Props = {|
  isSuccess: boolean,
  onButtonPress: () => void,
  onCardPress: (item: DisciplineCard | ChapterCard) => void,
  onClose: () => void,
  recommendedContent: DisciplineCard | ChapterCard
|};

const PADDING_WIDTH = theme.spacing.base;
export const POSITIVE_COLOR = theme.colors.positive;
export const NEGATIVE_COLOR = theme.colors.negative;

const styles = StyleSheet.create({
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
  recommendedContent: {
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
  }
});

class LevelEnd extends React.PureComponent<Props> {
  handleCardPress = (item: DisciplineCard | ChapterCard) => () => this.props.onCardPress(item);

  handleButtonPress = () => this.props.onButtonPress();

  render() {
    const {isSuccess, onClose, recommendedContent} = this.props;
    const header = (isSuccess && translations.congratulations) || translations.ooops;
    const backgroundColor = (isSuccess && styles.positive) || styles.negative;
    const screenWidth: number = Dimensions.get('window').width;

    return (
      <BrandThemeContext.Consumer>
        {brandTheme => (
          <View>
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
                  <TouchableOpacity
                    testID="button-close"
                    onPress={onClose}
                    hitSlop={defaultHitSlop}
                  >
                    <CloseIcon height={16} width={16} color={theme.colors.white} />
                  </TouchableOpacity>
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
                  <View style={styles.recommendedContent}>
                    <Text style={styles.title}>{translations.relatedSubjects}</Text>
                    <Card type={CARD_TYPE.CONTAIN} style={styles.card} shadowStyle={BOX_STYLE}>
                      <CatalogItem
                        title={recommendedContent.title}
                        subtitle={recommendedContent.authors.map(author => author.label).join(', ')}
                        progression={{
                          current: recommendedContent.completion,
                          count: 1
                        }}
                        image={{uri: getCleanUri(recommendedContent.image)}}
                        authorType={getAuthorType(recommendedContent)}
                        authorName={
                          getAuthorType(recommendedContent) !== AUTHOR_TYPE.CUSTOM
                            ? getAuthorName(recommendedContent)
                            : brandTheme.name
                        }
                        badge={recommendedContent.isNew ? translations.new : ''}
                        isAdaptive={recommendedContent.adaptiv}
                        displayMode={CARD_DISPLAY_MODE.CARD}
                        onPress={this.handleCardPress(recommendedContent)}
                        testID={`recommend-item-${recommendedContent.universalRef.replace(
                          /_/g,
                          '-'
                        )}`}
                        isCertified={getAuthorType(recommendedContent) === AUTHOR_TYPE.VERIFIED}
                      />
                    </Card>
                  </View>
                </View>
              </View>
            </ScrollView>
            <ButtonSticky
              onPress={this.handleButtonPress}
              testID={`button-${isSuccess ? 'next' : 'retry'}-level`}
            >
              {(isSuccess && translations.nextLevel) || translations.retryLevel}
            </ButtonSticky>
          </View>
        )}
      </BrandThemeContext.Consumer>
    );
  }
}

export default LevelEnd;
