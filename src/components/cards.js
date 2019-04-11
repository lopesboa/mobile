// @flow

import * as React from 'react';
import DeckSwiper from '@coorpacademy/react-native-deck-swiper';

import theme from '../modules/theme';
import type {CardType, Resource} from '../types';

export type Card = {|
  title: string,
  type: CardType,
  resource?: Resource,
  offeringExtraLife?: boolean,
  isCorrect: boolean
|};

export type Props = {|
  testID: string,
  items: Array<Card>,
  renderItem: Card => React.Node,
  cardStyle?: GenericStyleProp,
  onRef: (element: DeckSwiper | null) => void,
  onSwiped: (cardIndexSwiped: number) => void,
  onSwipedAll: () => void,
  cardIndexShown?: number
|};

const Cards = ({
  items,
  renderItem,
  cardStyle,
  onRef,
  onSwiped,
  onSwipedAll,
  cardIndexShown = 0,
  testID
}: Props) => (
  <DeckSwiper
    cards={items}
    onSwiped={onSwiped}
    onSwipedAll={onSwipedAll}
    cardIndex={cardIndexShown}
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
    ref={onRef}
  />
);

export default Cards;
