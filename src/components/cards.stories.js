// @flow

import * as React from 'react';
import {Text, View} from 'react-native';
import renderer from 'react-test-renderer';
import {storiesOf} from '@storybook/react-native';
import DeckSwiper from '@coorpacademy/react-native-deck-swiper';

import {handleFakePress, createFakeVibration} from '../utils/tests';
import {__TEST__} from '../modules/environment';
import {CARD_TYPE} from '../const';
import {Component as Cards} from './cards';
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
    items={items}
    renderItem={renderCard}
    vibration={createFakeVibration()}
  />
));

if (__TEST__) {
  describe('Cards', () => {
    it('should handle callbacks (onSwiped and forceUpdate)', () => {
      const handleSwiped = jest.fn();
      const handleSwipedAll = jest.fn();
      const vibration = createFakeVibration();

      const component = renderer.create(
        <Cards
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
