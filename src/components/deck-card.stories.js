// @flow

import * as React from 'react';
import {Text} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import DeckCard from './deck-card';

storiesOf('DeckCard', module).add('Default', () => (
  <DeckCard>
    <Text>foo</Text>
  </DeckCard>
));
