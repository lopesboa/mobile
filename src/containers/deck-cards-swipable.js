// @flow

import * as React from 'react';
import {connect} from 'react-redux';
import {Animated, Easing} from 'react-native';
import {selectResource} from '@coorpacademy/player-store';

import DeckCards from '../components/deck-cards';
import type {Props as DeckCardsProps, DeckCard} from '../components/deck-cards';
import {ANALYTICS_EVENT_TYPE} from '../const';

import withAnalytics from './with-analytics';
import type {WithAnalyticsProps} from './with-analytics';

type ConnectedDispatchProps = {|
  selectResource: typeof selectResource
|};

type Props = $Exact<{|
  ...WithAnalyticsProps,
  ...ConnectedDispatchProps,
  items: Array<DeckCard>,
  renderItem: (DeckCard, number, AnimationStyleProp | void) => React.Node,
  cardStyle?: ViewStyleProp,
  onRef?: $PropertyType<DeckCardsProps, 'onRef'>
|}>;

type State = {|
  cardIndexShown: number
|};

class DeckCardsSwipable extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    cardIndexShown: 0
  };

  cards: typeof DeckCards;

  // to simulate the swipe
  animation: Animated.Value = new Animated.Value(0);

  hint = Animated.loop(
    Animated.sequence([
      Animated.delay(3000),
      Animated.timing(this.animation, {
        toValue: 1,
        duration: 200,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.delay(150),
      Animated.timing(this.animation, {
        toValue: 2,
        duration: 400,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.delay(150),
      Animated.timing(this.animation, {
        toValue: 3,
        duration: 200,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.delay(3000)
    ])
  );

  componentDidMount = () => {
    this.hint.start();

    const cardOnTop = this.props.items[0];
    if (cardOnTop && cardOnTop.resource) {
      this.props.selectResource(cardOnTop.resource._id);
    }
  };

  componentWillUpdate = (nextProps: Props) => {
    if (JSON.stringify(this.props.cardStyle) !== JSON.stringify(nextProps.cardStyle)) {
      // Force update when cardStyle prop changes
      // $FlowFixMe HOC type is not perfect
      this.cards && this.cards.forceUpdate();
    }
  };

  handleRef = (element: typeof DeckCards | null) => {
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

    const cardOnTop = items[(cardIndexSwiped + 1) % items.length];
    if (cardOnTop && cardOnTop.resource) {
      this.props.selectResource(cardOnTop.resource._id);
    }

    this.setState({cardIndexShown: cardIndexSwiped + 1});
    this.hint.stop();
    this.animation.resetAnimation();
  };

  handleSwipedAll = () => {
    this.setState({cardIndexShown: 0});
  };

  getAnimationStyle = (): AnimationStyleProp => {
    const rotate = this.animation.interpolate({
      inputRange: [0, 1, 1.5, 2, 3],
      outputRange: ['0deg', '5deg', '0deg', '-5deg', '0deg']
    });

    const translateX = this.animation.interpolate({
      inputRange: [0, 1, 1.5, 2, 3],
      outputRange: [0, 30, 0, -30, 0]
    });

    const translateY = this.animation.interpolate({
      inputRange: [0, 1, 1.5, 2, 3],
      outputRange: [0, 30, 0, 30, 0]
    });

    const animationStyle = {
      transform: [{rotate}, {translateX}, {translateY}]
    };

    return animationStyle;
  };

  renderCard = (card: DeckCard, index: number) => {
    const {renderItem} = this.props;
    return renderItem(card, index, index === 0 && this.getAnimationStyle());
  };

  render() {
    const {items, cardStyle} = this.props;

    return (
      <DeckCards
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

const mapDispatchToProps: ConnectedDispatchProps = {
  selectResource
};

export {DeckCardsSwipable as Component};

export default connect(
  null,
  mapDispatchToProps
)(withAnalytics(DeckCardsSwipable));
