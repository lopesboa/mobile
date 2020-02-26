// @flow

import * as React from 'react';
import DeckSwiper from '@coorpacademy/react-native-deck-swiper';
import type {Answer} from '@coorpacademy/progression-engine';

import theme from '../modules/theme';
import type {DeckCardType, Resource} from '../types';
import withVibration from '../containers/with-vibration';
import type {WithVibrationProps} from '../containers/with-vibration';

export type DeckCard = {|
  answers?: Answer,
  userAnswers?: Answer,
  isCorrect: boolean,
  title: string,
  type: DeckCardType,
  resource?: Resource,
  offeringExtraLife?: boolean
|};

export type Props = {|
  ...WithVibrationProps,
  testID: string,
  items: Array<DeckCard>,
  renderItem: (DeckCard, number) => React.Node,
  cardStyle?: ViewStyleProp,
  onSwiped: (cardIndexSwiped: number) => void,
  onSwipedAll: () => void,
  cardIndexShown?: number
|};

class DeckCards extends React.PureComponent<Props> {
  props: Props;

  swiper: DeckSwiper;

  forceUpdate = () => {
    this.swiper && this.swiper.forceUpdate();
  };

  handleSwiped = (cardIndexSwiped: number) => {
    const {onSwiped, vibration} = this.props;

    vibration.vibrate();

    onSwiped(cardIndexSwiped);
  };

  handleRef = (element: DeckSwiper | null) => {
    this.swiper = element;
  };

  render() {
    const {items, renderItem, cardStyle, onSwipedAll, cardIndexShown = 0, testID} = this.props;

    return (
      <DeckSwiper
        testID={testID}
        cards={items}
        onSwiped={this.handleSwiped}
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
        ref={this.handleRef}
      />
    );
  }
}

export {DeckCards as Component};
export default withVibration(DeckCards);
