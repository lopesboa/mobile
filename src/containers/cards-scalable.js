// @flow

import * as React from 'react';
import DeckSwiper from '@coorpacademy/react-native-deck-swiper';

import Cards from '../components/cards';
import type {Card as CardType} from '../components/cards';

type Props = {|
  items: Array<CardType>,
  renderItem: CardType => React.Node,
  cardStyle?: GenericStyleProp,
  onRef?: (element: DeckSwiper | null) => void
|};

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

export default CardsScalable;
