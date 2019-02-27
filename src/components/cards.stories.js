// @flow

import * as React from 'react';
import {Text, View} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import {CARD_TYPE} from '../const';
import Cards from './cards';
import type {Card} from './cards';

const items: Array<Card> = [
  {title: 'First card', type: CARD_TYPE.TIP},
  {title: 'Second card', type: CARD_TYPE.KEY_POINT},
  {title: 'Third card', type: CARD_TYPE.CORRECTION}
];

const renderCard = ({type, title}: Card) => (
  <View style={{backgroundColor: '#fff', borderWidth: 1, borderColor: '#000'}}>
    <Text>{title}</Text>
    <Text>Foo bar baz</Text>
  </View>
);

storiesOf('Cards', module).add('Default', () => <Cards items={items} renderItem={renderCard} />);
