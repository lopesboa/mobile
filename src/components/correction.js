// @flow strict

import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import theme from '../modules/theme';
import type {Answer} from '../types';
import {CARD_TYPE} from '../const';
import CardComponent from '../containers/card-scalable';
import withLayout from '../containers/with-layout';
import type {WithLayoutProps} from '../containers/with-layout';
import Cards from '../containers/cards-scalable';
import LivesAnimated from '../containers/lives-animated';
import {STYLE as BOX_STYLE} from './box';
import Button, {HEIGHT as BUTTON_HEIGHT} from './button';
import Text from './text';
import Space from './space';
import type {Card} from './cards';
import CardCorrection from './card-correction';

type Props = {|
  ...WithLayoutProps,
  title: string,
  subtitle: string,
  tip: string,
  answers: Array<Answer>,
  question: string,
  userAnswers: Array<Answer>,
  isCorrect: boolean,
  keyPoint: string,
  onButtonPress: () => void,
  isFinished: boolean,
  lives?: number
|};

const CARDS_HEIGHT = 300;
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
  mainTitle: {
    color: theme.colors.white,
    fontSize: 28,
    fontWeight: theme.fontWeight.bold
  },
  subTitle: {
    fontSize: 17,
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
    color: theme.colors.gray.dark,
    fontSize: 15
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    paddingHorizontal: PADDING_WIDTH,
    paddingTop: PADDING_WIDTH
  },
  footer: {
    paddingHorizontal: PADDING_WIDTH,
    paddingBottom: PADDING_WIDTH
  }
});

class Correction extends React.PureComponent<Props> {
  props: Props;

  renderCard = ({type, title: cardTitle}: Card) => {
    const {answers, userAnswers, question, tip, keyPoint, isCorrect, layout} = this.props;
    // This is the offset added by the deck swiper
    const offsetBottom = CARDS_LENGTH * 7;
    const fullScreenOffsetBottom = BUTTON_HEIGHT + PADDING_WIDTH;
    // $FlowFixMe layout is defined as we check it before rendering Cards component
    const fullScreenHeight = layout.height - PADDING_WIDTH * 2 - fullScreenOffsetBottom;

    return (
      <CardComponent
        title={cardTitle}
        type={type}
        height={CARDS_HEIGHT}
        fullScreenHeight={fullScreenHeight}
        offsetBottom={offsetBottom}
        fullScreenOffsetBottom={fullScreenOffsetBottom}
        style={styles.card}
        testID={`card-${type.toLowerCase()}`}
      >
        {type === CARD_TYPE.TIP && <Text style={styles.cardText}>{tip}</Text>}
        {type === CARD_TYPE.CORRECTION && (
          <CardCorrection
            question={question}
            answers={answers}
            userAnswers={userAnswers}
            isCorrect={isCorrect}
          />
        )}
        {type === CARD_TYPE.KEY_POINT && <Text style={styles.cardText}>{keyPoint}</Text>}
      </CardComponent>
    );
  };

  render() {
    const {title, subtitle, isCorrect, onButtonPress, layout, isFinished, lives} = this.props;

    const correctionCard: Card = {type: CARD_TYPE.CORRECTION, title: 'Correction'};
    const tipCard = {type: CARD_TYPE.TIP, title: 'Did you know that?'};
    const keyPointCard = {type: CARD_TYPE.KEY_POINT, title: 'Key Point'};

    const cards: Array<Card> = isCorrect
      ? [tipCard, keyPointCard, correctionCard]
      : [correctionCard, keyPointCard, tipCard];

    return (
      <View
        style={[styles.container, isCorrect ? styles.positive : styles.negative]}
        testID={`correction-${isCorrect ? 'success' : 'error'}`}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.mainTitle} testID="correction-title">
              {title}
            </Text>
            <Text style={styles.subTitle} testID="correction-subtitle">
              {subtitle}
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
            cardStyle={{paddingTop: (layout.height - CARDS_HEIGHT) / 2}}
          />
        )}
        <Space type="base" />
        <View style={styles.footer}>
          <Button
            isInverted
            onPress={onButtonPress}
            testID={`button-${isFinished ? 'continue' : 'next-question'}`}
          >
            {(isFinished && 'Continue') || 'Next Question'}
          </Button>
        </View>
      </View>
    );
  }
}

export {Correction as Component};
export default withLayout(Correction);
