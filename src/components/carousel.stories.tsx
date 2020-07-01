import * as React from 'react';
import {Text} from 'react-native';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress, fakeLayout} from '../utils/tests';
import {Component as Carousel} from './carousel';

const data = [
  {title: 'foo', color: '#99f'},
  {title: 'bar', color: '#888'},
  {title: 'baz', color: '#00f'},
  {title: 'qux', color: '#123'},
];
const renderItem = ({item: {title, color}, index}) => (
  <Text
    style={{
      padding: 20,
      backgroundColor: color,
      color: '#fff',
    }}
  >
    {title}
  </Text>
);

storiesOf('Carousel', module)
  .add('Default', () => (
    <Carousel data={data} renderItem={renderItem} currentIndex={1} onChange={handleFakePress} />
  ))
  .add('With layout', () => (
    <Carousel
      data={data}
      renderItem={renderItem}
      currentIndex={1}
      onChange={handleFakePress}
      layout={fakeLayout}
    />
  ));
