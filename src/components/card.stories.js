// @flow

import * as React from 'react';
import {Text} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import {CARD_TYPE} from '../const';
import Card from './card';

storiesOf('Card', module)
  .add('Tip', () => (
    <Card type={CARD_TYPE.TIP} title="Foo bar baz">
      <Text>A sponsored post is a small advertising insert appearing in users’ timelines.</Text>
    </Card>
  ))
  .add('Key point', () => (
    <Card type={CARD_TYPE.KEY_POINT} title="Foo bar baz">
      <Text>A sponsored post is a small advertising insert appearing in users’ timelines.</Text>
    </Card>
  ))
  .add('Correction', () => (
    <Card type={CARD_TYPE.CORRECTION} title="Foo bar baz">
      <Text>A sponsored post is a small advertising insert appearing in users’ timelines.</Text>
    </Card>
  ));
