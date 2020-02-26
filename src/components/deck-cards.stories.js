// @flow

import * as React from 'react';
import {Text, View} from 'react-native';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';
import DeckSwiper from '@coorpacademy/react-native-deck-swiper';

import {handleFakePress, createFakeVibration} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {DECK_CARD_TYPE} from '../const';
import {Component as DeckCards} from './deck-cards';
import type {DeckCard} from './deck-cards';

const items: Array<DeckCard> = [
  {title: 'First card', type: DECK_CARD_TYPE.TIP, isCorrect: true},
  {title: 'Second card', type: DECK_CARD_TYPE.KEY_POINT, isCorrect: true},
  {title: 'Third card', type: DECK_CARD_TYPE.CORRECTION, isCorrect: true}
];

const renderCard = ({type, title}: DeckCard) => (
  <View style={{backgroundColor: '#fff', borderWidth: 1, borderColor: '#000'}}>
    <Text>{title}</Text>
    <Text>Foo bar baz</Text>
  </View>
);

storiesOf('DeckCards', module).add('Default', () => (
  <DeckCards
    testID="cards-story"
    onSwiped={handleFakePress}
    onSwipedAll={handleFakePress}
    items={items}
    renderItem={renderCard}
    vibration={createFakeVibration()}
  />
));

if (__TEST__) {
  describe('DeckCards', () => {
    it('should handle callbacks (onSwiped and forceUpdate)', () => {
      const handleSwiped = jest.fn();
      const handleSwipedAll = jest.fn();
      const vibration = createFakeVibration();

      const component = renderer.create(
        <DeckCards
          testID="cards-story"
          onSwiped={handleSwiped}
          onSwipedAll={handleSwipedAll}
          cardIndexShown={0}
          items={items}
          renderItem={renderCard}
          vibration={vibration}
        />
      );

      const swiper = component.root.findByType(DeckSwiper);
      swiper.instance.onSwipedCallbacks(false, true);

      expect(handleSwiped).toHaveBeenCalledTimes(1);
      expect(vibration.vibrate).toHaveBeenCalledTimes(1);
      expect(handleSwipedAll).toHaveBeenCalledTimes(1);

      const cards = component.root.find(el => el.props.testID === 'cards-story');
      cards.instance.forceUpdate();
    });
  });
}
