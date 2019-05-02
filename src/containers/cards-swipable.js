// @flow

import * as React from 'react';
import {Animated, Easing} from 'react-native';

import Cards from '../components/cards';
import type {Props as CardsProps, Card as CardType} from '../components/cards';
import {ANALYTICS_EVENT_TYPE} from '../const';

import withAnalytics from './with-analytics';
import type {WithAnalyticsProps} from './with-analytics';

type Props = $Exact<{|
  ...WithAnalyticsProps,
  items: Array<CardType>,
  renderItem: (CardType, number, GenericStyleProp | void) => React.Node,
  cardStyle?: GenericStyleProp,
  onRef?: $PropertyType<CardsProps, 'onRef'>
|}>;

type State = {|
  cardIndexShown: number
|};

class CardsSwipable extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    cardIndexShown: 0
  };

  cards: Cards;

  // to simulate the swipe
  rotate: Animated.Value = new Animated.Value(0);

  hint = Animated.loop(
    Animated.sequence([
      Animated.delay(3000),
      Animated.timing(this.rotate, {
        toValue: 1,
        duration: 200,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.delay(150),
      Animated.timing(this.rotate, {
        toValue: 2,
        duration: 400,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.delay(150),
      Animated.timing(this.rotate, {
        toValue: 3,
        duration: 200,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.delay(3000)
    ])
  );

  componentDidMount = () => {
    this.hint.start();
  };

  componentWillUpdate = (nextProps: Props) => {
    if (JSON.stringify(this.props.cardStyle) !== JSON.stringify(nextProps.cardStyle)) {
      // Force update when cardStyle prop changes
      this.cards && this.cards.forceUpdate();
    }
  };

  handleRef = (element: Cards | null) => {
    if (element) {
      this.cards = element;
    }
  };

  handleSwiped = (cardIndexSwiped: number) => {
    const {analytics, items} = this.props;
    const item = items[cardIndexSwiped];
    const {isCorrect, resource, type, offeringExtraLife} = item;

    let data = {
      id: 'deck-card',
      type: resource ? `${type}-${resource.type}` : type,
      isCorrect: +isCorrect
    };

    if (resource) {
      data = {
        ...data,
        ref: resource.ref,
        offeringExtraLife: +offeringExtraLife
      };
    }

    analytics && analytics.logEvent(ANALYTICS_EVENT_TYPE.SWIPE, data);

    this.setState({cardIndexShown: cardIndexSwiped + 1});
    this.hint.stop();
  };

  handleSwipedAll = () => {
    this.setState({cardIndexShown: 0});
  };

  getAnimationStyle = (): GenericStyleProp => {
    const rotate = this.rotate.interpolate({
      inputRange: [0, 1, 1.5, 2, 3],
      outputRange: ['0deg', '5deg', '0deg', '-5deg', '0deg']
    });

    const translateX = this.rotate.interpolate({
      inputRange: [0, 1, 1.5, 2, 3],
      outputRange: [0, 30, 0, -30, 0]
    });

    const translateY = this.rotate.interpolate({
      inputRange: [0, 1, 1.5, 2, 3],
      outputRange: [0, 30, 0, 30, 0]
    });

    const animationStyle = {
      transform: [{rotate}, {translateX}, {translateY}]
    };

    return animationStyle;
  };

  renderCard = (card: CardType, index: number) => {
    const {renderItem} = this.props;
    return renderItem(card, index, index === 0 && this.getAnimationStyle());
  };

  render() {
    const {items, cardStyle} = this.props;

    return (
      <Cards
        testID="cards"
        items={items}
        renderItem={this.renderCard}
        cardStyle={cardStyle}
        onSwiped={this.handleSwiped}
        onSwipedAll={this.handleSwipedAll}
        cardIndexShown={this.state.cardIndexShown}
        ref={this.handleRef}
      />
    );
  }
}

export {CardsSwipable as Component};
export default withAnalytics(CardsSwipable);
