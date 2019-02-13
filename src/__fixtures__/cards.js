// @flow strict

import type {Card} from '../components/cards';
import {CARD_TYPE} from '../const';

export const cards: Array<Card> = [
  {title: 'First card', type: CARD_TYPE.TIP},
  {title: 'Second card', type: CARD_TYPE.KEY_POINT},
  {title: 'Third card', type: CARD_TYPE.CORRECTION}
];

export default {
  cards
};
