// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import CarouselCard from './carousel-card';

const item = {
  iconName: 'computer',
  header: 'STEP 01',
  description: 'Some description goes here'
};
storiesOf('Carousel', module)
  .add('Default', () => <CarouselCard item={item} itemIndex={1} currentIndex={1} width={200} />)
  .add('Custom Style', () => (
    <CarouselCard item={item} itemIndex={2} currentIndex={1} width={200} />
  ));
