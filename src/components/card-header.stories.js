// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {CARD_TYPE} from '../const';
import CardHeader from './card-header';

storiesOf('Card Header', module)
  .add('Tip', () => <CardHeader type={CARD_TYPE.TIP} title="Foo bar baz" />)
  .add('Key point', () => <CardHeader type={CARD_TYPE.KEY_POINT} title="Foo bar baz" />)
  .add('Correction', () => <CardHeader type={CARD_TYPE.CORRECTION} title="Foo bar baz" />);
