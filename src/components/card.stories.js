// @flow

import * as React from 'react';
import {Text, View} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import theme from '../modules/theme';
import Card, {LAYOUT} from './card';

const children = (
  <View style={{padding: theme.spacing.base, backgroundColor: theme.colors.light.white}}>
    <Text>A sponsored post is a small advertising insert appearing in users’ timelines.</Text>
  </View>
);

storiesOf('Card', module)
  .add('Default', () => <Card>{children}</Card>)
  .add('Deck swipe', () => <Card type={LAYOUT.DECK_SWIPE}>{children}</Card>)
  .add('Contain', () => <Card type={LAYOUT.CONTAIN}>{children}</Card>);
