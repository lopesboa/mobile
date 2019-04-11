// @flow

import * as React from 'react';
import {Text, View} from 'react-native';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';
import DeckSwiper from '@coorpacademy/react-native-deck-swiper';

import {handleFakePress} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {CARD_TYPE} from '../const';
import Cards from './cards';
import type {Card} from './cards';

const items: Array<Card> = [
  {title: 'First card', type: CARD_TYPE.TIP, isCorrect: true},
  {title: 'Second card', type: CARD_TYPE.KEY_POINT, isCorrect: true},
  {title: 'Third card', type: CARD_TYPE.CORRECTION, isCorrect: true}
];

const renderCard = ({type, title}: Card) => (
  <View style={{backgroundColor: '#fff', borderWidth: 1, borderColor: '#000'}}>
    <Text>{title}</Text>
    <Text>Foo bar baz</Text>
  </View>
);

storiesOf('Cards', module).add('Default', () => (
  <Cards
    testID="cards-story"
    onSwiped={handleFakePress}
    onSwipedAll={handleFakePress}
    onRef={handleFakePress}
    items={items}
    renderItem={renderCard}
  />
));

if (__TEST__) {
  describe('Cards', () => {
    it('should handle onSwiped callback', () => {
      const mockOnSwiped = jest.fn();
      const mockOnSwipedAll = jest.fn();
      const mockOnRef = jest.fn();

      const component = renderer.create(
        <Cards
          testID="cards-story"
          onSwiped={mockOnSwiped}
          onSwipedAll={mockOnSwipedAll}
          onRef={mockOnRef}
          cardIndexShown={0}
          items={items}
          renderItem={renderCard}
        />
      );

      const swiper = component.root.findByType(DeckSwiper);
      swiper.instance.onSwipedCallbacks(false, true);
      expect(mockOnSwiped.mock.calls.length).toBe(1);
      expect(mockOnSwipedAll.mock.calls.length).toBe(1);
      expect(mockOnRef.mock.calls.length).toBe(1);
    });
  });
}
