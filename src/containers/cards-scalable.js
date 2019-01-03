// @flow

import * as React from 'react';
import DeckSwiper from '@coorpacademy/react-native-deck-swiper';

import Cards from '../components/cards';
import type {Props as CardsProps} from '../components/cards';

type Props = CardsProps;

class CardsScalable extends React.PureComponent<Props> {
  props: Props;

  swiper: DeckSwiper;

  componentWillUpdate = (nextProps: Props) => {
    if (JSON.stringify(this.props.cardStyle) !== JSON.stringify(nextProps.cardStyle)) {
      // Force update when cardStyle prop changes
      this.swiper.forceUpdate();
    }
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
      <Cards items={items} renderItem={renderItem} cardStyle={cardStyle} onRef={this.handleRef} />
    );
  }
}

export default CardsScalable;
