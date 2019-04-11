// @flow

import * as React from 'react';
import DeckSwiper from '@coorpacademy/react-native-deck-swiper';

import Cards from '../components/cards';
import type {Card as CardType} from '../components/cards';
import {ANALYTICS_EVENT_TYPE} from '../const';

import withAnalytics from './with-analytics';
import type {WithAnalyticsProps} from './with-analytics';

type Props = $Exact<{|
  ...WithAnalyticsProps,
  items: Array<CardType>,
  renderItem: CardType => React.Node,
  cardStyle?: GenericStyleProp,
  onRef?: (element: DeckSwiper | null) => void
|}>;

type State = {|
  cardIndexShown: number
|};

class CardsScalable extends React.PureComponent<Props, State> {
  props: Props;

  state: State = {
    cardIndexShown: 0
  };

  swiper: DeckSwiper;

  componentWillUpdate = (nextProps: Props) => {
    if (JSON.stringify(this.props.cardStyle) !== JSON.stringify(nextProps.cardStyle)) {
      // Force update when cardStyle prop changes
      this.swiper.forceUpdate();
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
  };

  handleSwipedAll = () => {
    this.setState({cardIndexShown: 0});
  };

  handleRef = (element: DeckSwiper | null) => {
    const {onRef} = this.props;
    this.swiper = element;

    if (onRef) {
      onRef(element);
    }
  };

  render() {
    const {items, renderItem, cardStyle} = this.props;

    return (
      <Cards
        testID="cards"
        items={items}
        renderItem={renderItem}
        cardStyle={cardStyle}
        onRef={this.handleRef}
        onSwiped={this.handleSwiped}
        onSwipedAll={this.handleSwipedAll}
        cardIndexShown={this.state.cardIndexShown}
      />
    );
  }
}

export {CardsScalable as Component};
export default withAnalytics(CardsScalable);
