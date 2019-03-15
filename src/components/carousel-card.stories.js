// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {Component as CarouselCard} from './carousel-card';

const item = {
  iconName: 'computer',
  header: 'STEP 01',
  description: 'Some description goes here'
};
storiesOf('Carousel', module)
  .add('Default', () => <CarouselCard item={item} />)
  .add('Custom Style', () => <CarouselCard item={item} />);
