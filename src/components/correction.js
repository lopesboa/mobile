// @flow strict

/* eslint-disable import/max-dependencies*/

import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import type {LessonType} from '@coorpacademy/progression-engine';

import type {Resource as ResourceType} from '../types';
import theme from '../modules/theme';
import DeckCardScalable from '../containers/deck-card-scalable';
import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import withVibration from '../containers/with-vibration';
import type {WithVibrationProps} from '../containers/with-vibration';
import withAudio from '../containers/with-audio';
import type {WithAudioProps} from '../containers/with-audio';
import DeckCardsSwipable from '../containers/deck-cards-swipable';
import translations from '../translations';
import {RESOURCE_TYPE, DECK_CARD_TYPE} from '../const';
import Resource from './resource';
import {STYLE as BOX_STYLE} from './box';
import Button, {HEIGHT as BUTTON_HEIGHT} from './button';
import Loader from './loader';
import Text from './text';
import Html from './html';
import Space from './space';
import Lives from './lives';
import type {DeckCard} from './deck-cards';
import DeckCardCorrection from './deck-card-correction';

const CARDS_HEIGHT = 360;
const CARDS_LENGTH = 3;
const PADDING_WIDTH = theme.spacing.base;
export const POSITIVE_COLOR = theme.colors.positive;
export const NEGATIVE_COLOR = theme.colors.negative;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
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

type Props = $Exact<{|
  ...WithLayoutProps,
  ...WithVibrationProps,
  ...WithAudioProps,
  question: string,
  answers: Array<string>,
  userAnswers: Array<string>,
  tip: string,
  keyPoint: string,
  isCorrect?: boolean,
  onButtonPress: () => void,
  isResourceViewed?: boolean,
  offeringExtraLife?: boolean,
  hasConsumedExtraLife?: boolean,
  resources?: Array<ResourceType>,
  lives?: number,
  isGodModeEnabled?: boolean,
  isFastSlideEnabled?: boolean,
  onPDFButtonPress: (url: string, description: string) => void,
  onVideoPlay: () => void,
  testID?: string
|}>;

class Correction extends React.PureComponent<Props> {
  props: Props;

  componentDidUpdate(prevProps: Props) {
    const {isCorrect, vibration, audio} = this.props;

    if (prevProps.isCorrect === undefined && isCorrect !== undefined) {
      if (!isCorrect) {
        vibration.vibrate(vibration.VIBRATION_TYPE.NOTIFICATION_ERROR);
        audio.play(audio.AUDIO_FILE.WRONG_ANSWER);
      } else {
        vibration.vibrate(vibration.VIBRATION_TYPE.NOTIFICATION_SUCCESS);
        audio.play(audio.AUDIO_FILE.GOOD_ANSWER);
      }
    }
  }

  handleResourcePress = (lessonType: LessonType) => (url?: string, description?: string) => {
    const {onPDFButtonPress, onVideoPlay} = this.props;

    // here the condition url && description in not enough te determine (the url and description are send everytime)
    // if we should use onPDFButtonPress or videoPlay
    // so we need to check also the lessonType

    if (lessonType === RESOURCE_TYPE.PDF && url && description) {
      return onPDFButtonPress(url, description);
    }

    return onVideoPlay();
  };

  getCards(isCorrect: boolean): Array<DeckCard> {
    const {
      answers,
      userAnswers,
      isResourceViewed,
      resources,
      offeringExtraLife,
      hasConsumedExtraLife
    } = this.props;

    const correctionCard: DeckCard = {
      answers,
      userAnswers,
      type: DECK_CARD_TYPE.CORRECTION,
      title: translations.correction,
      isCorrect
    };
    const tipCard = {
      type: DECK_CARD_TYPE.TIP,
      title: translations.didYouKnowThat,
      isCorrect
    };

    const keyPointCard = {
      type: DECK_CARD_TYPE.KEY_POINT,
      title: translations.keyPoint,
      isCorrect
    };
    const lessonCards =
      (resources &&
        resources.map(resource => ({
          type: DECK_CARD_TYPE.RESOURCE,
          title: translations.accessTheLesson,
          resource,
          isCorrect,
          offeringExtraLife
        }))) ||
      [];

    let cards: Array<DeckCard> = [];

    if (isCorrect && isResourceViewed) {
      cards = [tipCard, keyPointCard, correctionCard, ...lessonCards];
    } else if (isCorrect && !isResourceViewed) {
      cards = [tipCard, ...lessonCards, keyPointCard, correctionCard];
    } else if (!isCorrect && (offeringExtraLife || hasConsumedExtraLife)) {
      cards = [...lessonCards, correctionCard, keyPointCard, tipCard];
    } else if (!isCorrect && isResourceViewed) {
      cards = [correctionCard, keyPointCard, ...lessonCards, tipCard];
    } else {
      cards = [correctionCard, ...lessonCards, keyPointCard, tipCard];
    }

    return cards;
  }

  getOffsetBottom = (): number => CARDS_LENGTH * 7;

  getExpandedOffsetBottom = (): number => BUTTON_HEIGHT + PADDING_WIDTH;

  getCardsExpandedHeight = (): number =>
    // $FlowFixMe layout is defined as we check it before rendering Cards component
    this.props.layout.height - PADDING_WIDTH * 2 - this.getExpandedOffsetBottom();

  // @todo to be enhanced
  getCardsHeight = (): number => CARDS_HEIGHT;

  renderCard = (
    {answers, userAnswers, type, title: cardTitle, resource, offeringExtraLife}: DeckCard,
    index: number,
    animationStyle: AnimationStyleProp
  ) => {
    const {question, tip, keyPoint, isCorrect} = this.props;
    // This is the offset added by the deck swiper
    const testIDSuffix = resource ? resource.ref.toLowerCase() : '';
    const testID =
      type !== DECK_CARD_TYPE.RESOURCE
        ? `card-${type.toLowerCase()}`
        : `card-${type.toLowerCase()}-` + testIDSuffix;

    return (
      <DeckCardScalable
        title={cardTitle}
        isCorrect={isCorrect}
        type={type}
        animationStyle={type !== DECK_CARD_TYPE.RESOURCE && animationStyle}
        height={this.getCardsHeight()}
        expandedHeight={this.getCardsExpandedHeight()}
        offsetBottom={this.getOffsetBottom()}
        expandedOffsetBottom={this.getExpandedOffsetBottom()}
        style={styles.card}
        testID={testID}
      >
        {type === DECK_CARD_TYPE.TIP ? (
          <Html fontSize={theme.fontSize.regular} style={styles.cardText}>
            {tip}
          </Html>
        ) : null}
        {type === DECK_CARD_TYPE.CORRECTION && answers && userAnswers ? (
          <DeckCardCorrection
            question={question}
            answers={answers}
            userAnswers={userAnswers}
            isCorrect={Boolean(isCorrect)}
          />
        ) : null}
        {type === DECK_CARD_TYPE.KEY_POINT ? (
          <Html fontSize={theme.fontSize.regular} style={styles.cardText}>
            {keyPoint}
          </Html>
        ) : null}
        {type === DECK_CARD_TYPE.RESOURCE && resource ? (
          <React.Fragment>
            <Resource
              type={resource.type}
              url={resource.url}
              videoId={resource.videoId}
              mimeType={resource.mimeType}
              description={resource.description}
              thumbnail={resource.poster}
              onPress={this.handleResourcePress(resource.type)}
              testID={`${testID}-resource`}
              extralifeOverlay={offeringExtraLife}
              containerStyle={styles.resource}
            />
            <View style={styles.resourceTitleContainer}>
              <Html
                fontSize={theme.fontSize.regular}
                testID={`${testID}-resource-description`}
                style={styles.resourceTitle}
                isTextCentered
              >
                {resource.description}
              </Html>
            </View>
          </React.Fragment>
        ) : null}
      </DeckCardScalable>
    );
  };

  render() {
    const {
      isCorrect,
      onButtonPress,
      layout,
      lives: _lives,
      isGodModeEnabled,
      isFastSlideEnabled,
      offeringExtraLife,
      hasConsumedExtraLife,
      testID = 'correction'
    } = this.props;
    const lives = hasConsumedExtraLife && _lives !== undefined ? _lives + 1 : _lives;
    const canGoNext = lives === undefined || lives > 0;

    let analyticsID;
    if (canGoNext) {
      analyticsID = 'button-next-question';
    } else if (offeringExtraLife) {
      analyticsID = 'button-refuse-extralife';
    } else {
      analyticsID = 'button-game-over';
    }

    const isLoading = isCorrect === undefined || !layout;

    return (
      <View
        style={[
          styles.container,
          isLoading && styles.loaderContainer,
          !isLoading && (isCorrect ? styles.positive : styles.negative)
        ]}
        testID={`${testID}-${(isLoading && 'loading') || (isCorrect ? 'success' : 'error')}`}
      >
        {isLoading ? <Loader /> : null}
        {!isLoading ? (
          <React.Fragment>
            <View style={styles.header}>
              <View>
                <Text style={styles.title} testID="correction-title">
                  {(isCorrect && translations.goodJob) || translations.ouch}
                </Text>
                <Text style={styles.explanation} testID="correction-explanation">
                  {(isCorrect && translations.goodAnswer) || translations.wrongAnswer}
                </Text>
              </View>
              {lives !== undefined ? (
                <Lives
                  count={lives}
                  animationDirection={
                    (hasConsumedExtraLife && 'top') || (!isCorrect && 'bottom') || undefined
                  }
                  isGodModeEnabled={isGodModeEnabled}
                  isFastSlideEnabled={isFastSlideEnabled}
                  height={67}
                  testID="correction-lives"
                />
              ) : null}
            </View>
            <Space type="base" />
            <DeckCardsSwipable
              items={this.getCards(Boolean(isCorrect))}
              renderItem={this.renderCard}
              // $FlowFixMe layout has already been checked
              cardStyle={{paddingTop: (layout.height - this.getCardsHeight()) / 2}}
            />
            <Space type="base" />
            <View style={styles.footer}>
              <Button
                isInverted={!offeringExtraLife}
                isInlined={offeringExtraLife}
                onPress={onButtonPress}
                testID={`button-${canGoNext ? 'next-question' : 'quit'}`}
                analyticsID={analyticsID}
              >
                {offeringExtraLife ? translations.quit : translations.next}
              </Button>
            </View>
          </React.Fragment>
        ) : null}
      </View>
    );
  }
}

export {Correction as Component};
export default withVibration(withAudio(withLayout(Correction)));
