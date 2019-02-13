// @flow

import * as React from 'react';
import {Text, View} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import {cards} from '../__fixtures__/cards';
import Cards from './cards';
import type {Card} from './cards';

const renderCard = ({type, title}: Card) => (
  <View style={{backgroundColor: '#fff', borderWidth: 1, borderColor: '#000'}}>
    <Text>{title}</Text>
    <Text>Foo bar baz</Text>
  </View>
);

storiesOf('Cards', module).add('Default', () => <Cards items={cards} renderItem={renderCard} />);
