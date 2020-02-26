// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {DECK_CARD_TYPE} from '../const';
import DeckCardHeader from './deck-card-header';

storiesOf('DeckCardHeader', module)
  .add('Tip', () => <DeckCardHeader type={DECK_CARD_TYPE.TIP} title="Foo bar baz" />)
  .add('Key point', () => <DeckCardHeader type={DECK_CARD_TYPE.KEY_POINT} title="Foo bar baz" />)
  .add('Correction good', () => (
    <DeckCardHeader isCorrect type={DECK_CARD_TYPE.CORRECTION} title="Foo bar baz" />
  ))
  .add('Correction wrong', () => (
    <DeckCardHeader isCorrect={false} type={DECK_CARD_TYPE.CORRECTION} title="Foo bar baz" />
  ))
  .add('Resource', () => <DeckCardHeader type={DECK_CARD_TYPE.RESOURCE} title="Foo bar baz" />);
