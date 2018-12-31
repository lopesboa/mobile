// @flow

import * as React from 'react';
import DeckSwiper from 'react-native-deck-swiper';

import theme from '../modules/theme';
import type {CardType} from '../types';

export type Card = {|
  title: string,
  type: CardType
|};

type Props = {|
  items: Array<Card>,
  renderItem: Card => React.Node,
  cardStyle?: GenericStyleProp
|};

const Cards = ({items, renderItem, cardStyle}: Props) => (
  <DeckSwiper
    cards={items}
    renderCard={renderItem}
    stackSize={items.length}
    infinite
    animateCardOpacity
    cardVerticalMargin={0}
    stackSeparation={15}
    stackScale={5}
    backgroundColor="transparent"
    cardHorizontalMargin={theme.spacing.base}
    cardStyle={cardStyle}
  />
);

export default Cards;
