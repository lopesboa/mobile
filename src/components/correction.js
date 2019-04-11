// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import type {Resource as ResourceType} from '../types';
import theme from '../modules/theme';
import {CARD_TYPE} from '../const';
import CardComponent from '../containers/card-scalable';
import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import Cards from '../containers/cards-scalable';
import LivesAnimated from '../containers/lives-animated';
import translations from '../translations';
import {getSubtitlesUri} from '../modules/subtitles';
import Resource from '../containers/resource-scalable';
import {STYLE as BOX_STYLE} from './box';
import Button, {HEIGHT as BUTTON_HEIGHT} from './button';
import Text from './text';
import Html from './html';
import Space from './space';
import type {Card} from './cards';
import CardCorrection from './card-correction';
import {BrandThemeContext} from './brand-theme-provider';

type Props = $Exact<{|
  ...WithLayoutProps,
  tip: string,
  answers: Array<string>,
  question: string,
  userAnswers: Array<string>,
  isCorrect: boolean,
  keyPoint: string,
  onButtonPress: () => void,
  isLoading: boolean,
  isResourceViewed?: boolean,
  offeringExtraLife?: boolean,
  showResourcesFirst?: boolean,
  canGoNext?: boolean,
  resources: Array<ResourceType>,
  lives?: number,
  onPDFButtonPress: (url: string, description: string) => void,
  onVideoPlay: () => void
|}>;

const CARDS_HEIGHT = 360;
const CARDS_LENGTH = 3;
const PADDING_WIDTH = theme.spacing.base;
export const POSITIVE_COLOR = theme.colors.positive;
export const NEGATIVE_COLOR = theme.colors.negative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  positive: {
    backgroundColor: theme.colors.positive
  },
  negative: {
    backgroundColor: theme.colors.negative
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold
  },
  explanation: {
    fontSize: theme.fontSize.large,
    color: theme.colors.white
  },
  card: {
    ...BOX_STYLE,
    borderRadius: theme.radius.card,
    borderBottomWidth: 1,
    borderColor: 'rgba(20, 23, 26, 0.15)'
  },
  cards: {
    zIndex: 100
  },
  cardText: {
    color: theme.colors.gray.dark
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    paddingHorizontal: PADDING_WIDTH,
    paddingTop: PADDING_WIDTH
  },
  resourceTitleContainer: {
    padding: theme.spacing.base,
    justifyContent: 'center'
  },
  resourceTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fontSize.regular,
    color: '#556e79',
    fontWeight: theme.fontWeight.bold
  },
  resource: {
    flex: 0
  },
  footer: {
    paddingHorizontal: PADDING_WIDTH,
    paddingBottom: PADDING_WIDTH
  }
});

class Correction extends React.PureComponent<Props> {
  props: Props;

  createCards(): Array<Card> {
    const {
      isCorrect,
      isResourceViewed,
      resources,
      offeringExtraLife,
      showResourcesFirst
    } = this.props;
    const correctionCard: Card = {
      type: CARD_TYPE.CORRECTION,
      title: translations.correction,
      isCorrect
    };
    const tipCard = {
      type: CARD_TYPE.TIP,
      title: translations.didYouKnowThat,
      isCorrect
    };

    const keyPointCard = {
      type: CARD_TYPE.KEY_POINT,
      title: translations.keyPoint,
      isCorrect
    };
    const lessonCards = resources.map(resource => ({
      type: CARD_TYPE.RESOURCE,
      title: translations.accessTheLesson,
      resource,
      isCorrect,
      offeringExtraLife
    }));

    if (isCorrect && isResourceViewed) {
      return [tipCard, keyPointCard, correctionCard, ...lessonCards];
    } else if (isCorrect && !isResourceViewed) {
      return [tipCard, ...lessonCards, keyPointCard, correctionCard];
    } else if (showResourcesFirst) {
      return [...lessonCards, correctionCard, keyPointCard, tipCard];
    } else if (!isCorrect && isResourceViewed) {
      return [correctionCard, keyPointCard, ...lessonCards, tipCard];
    } else {
      return [correctionCard, ...lessonCards, keyPointCard, tipCard];
    }
  }

  getOffsetBottom = (): number => CARDS_LENGTH * 7;

  getExpandedOffsetBottom = (): number => BUTTON_HEIGHT + PADDING_WIDTH;

  getCardsExpandedHeight = (): number =>
    // $FlowFixMe layout is defined as we check it before rendering Cards component
    this.props.layout.height - PADDING_WIDTH * 2 - this.getExpandedOffsetBottom();

  // @todo to be enhanced
  getCardsHeight = (): number => CARDS_HEIGHT;

  renderCard = ({type, title: cardTitle, resource, offeringExtraLife}: Card) => {
    const {
      answers,
      userAnswers,
      question,
      tip,
      keyPoint,
      isCorrect,
      onPDFButtonPress,
      onVideoPlay
    } = this.props;
    // This is the offset added by the deck swiper
    const testIDSuffix: string = resource ? resource.ref.toLowerCase() : '';

    return (
      <BrandThemeContext.Consumer>
        {brandTheme => {
          const {host} = brandTheme;
          const subtitleRef = resource && resource.subtitleRef;
          const subtitleUri =
            host && subtitleRef && getSubtitlesUri(host, subtitleRef, translations.getLanguage());

          return (
            <CardComponent
              title={cardTitle}
              isCorrect={isCorrect}
              type={type}
              height={this.getCardsHeight()}
              expandedHeight={this.getCardsExpandedHeight()}
              offsetBottom={this.getOffsetBottom()}
              expandedOffsetBottom={this.getExpandedOffsetBottom()}
              style={styles.card}
              testID={
                type !== CARD_TYPE.RESOURCE
                  ? `card-${type.toLowerCase()}`
                  : `card-${type.toLowerCase()}-` + testIDSuffix
              }
            >
              {type === CARD_TYPE.TIP && (
                <Html fontSize={theme.fontSize.regular} style={styles.cardText}>
                  {tip}
                </Html>
              )}
              {type === CARD_TYPE.CORRECTION && (
                <CardCorrection
                  question={question}
                  answers={answers}
                  userAnswers={userAnswers}
                  isCorrect={isCorrect}
                />
              )}
              {type === CARD_TYPE.KEY_POINT && (
                <Html fontSize={theme.fontSize.regular} style={styles.cardText}>
                  {keyPoint}
                </Html>
              )}
              {type === CARD_TYPE.RESOURCE && resource && (
                <React.Fragment>
                  <Resource
                    type={resource.type}
                    url={resource.url}
                    description={resource.description}
                    thumbnail={resource.poster}
                    subtitles={subtitleUri}
                    onPDFButtonPress={onPDFButtonPress}
                    onVideoPlay={onVideoPlay}
                    testID={testIDSuffix}
                    extralifeOverlay={offeringExtraLife}
                    containerStyle={styles.resource}
                  />
                  <View style={styles.resourceTitleContainer}>
                    <Html
                      fontSize={theme.fontSize.regular}
                      testID={'resource-description-' + testIDSuffix}
                      style={styles.resourceTitle}
                      isTextCentered
                    >
                      {resource.description}
                    </Html>
                  </View>
                </React.Fragment>
              )}
            </CardComponent>
          );
        }}
      </BrandThemeContext.Consumer>
    );
  };

  render() {
    const {
      isCorrect,
      onButtonPress,
      layout,
      isLoading,
      lives,
      offeringExtraLife,
      canGoNext
    } = this.props;

    const cards = this.createCards();

    return (
      <View
        style={[styles.container, isCorrect ? styles.positive : styles.negative]}
        testID={`correction-${isCorrect ? 'success' : 'error'}`}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title} testID="correction-title">
              {(isCorrect && translations.goodJob) || translations.ouch}
            </Text>
            <Text style={styles.explanation} testID="correction-explanation">
              {(isCorrect && translations.goodAnswer) || translations.wrongAnswer}
            </Text>
          </View>
          {lives !== undefined && (
            <LivesAnimated
              count={lives}
              isBroken={!isCorrect}
              height={67}
              testID="correction-lives"
            />
          )}
        </View>
        <Space type="base" />
        {layout && (
          <Cards
            items={cards}
            renderItem={this.renderCard}
            cardStyle={{paddingTop: (layout.height - this.getCardsHeight()) / 2}}
          />
        )}
        <Space type="base" />
        <View style={styles.footer}>
          <Button
            isInverted={!offeringExtraLife}
            isInlined={offeringExtraLife}
            onPress={onButtonPress}
            isLoading={isLoading}
            testID={`button-${canGoNext ? 'next-question' : 'quit'}`}
            analyticsID={`button-${canGoNext ? 'next-question' : 'quit'}`}
          >
            {offeringExtraLife ? translations.quit : translations.next}
          </Button>
        </View>
      </View>
    );
  }
}

export {Correction as Component};
export default withLayout(Correction);
