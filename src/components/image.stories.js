// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import image from '../__fixtures__/image-landscape-2.jpg';
import Image from './image';

storiesOf('Image', module)
  .add('Default', () => <Image source={image} />)
  .add('Width', () => <Image source={image} width={200} />)
  .add('Max height', () => <Image source={image} width={200} maxHeight={100} />);
