// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import image from '../__fixtures__/image-landscape-3.jpg';
import {LEVEL_TYPE} from '../const';
import HeaderSlide from './header-slide';

storiesOf('HeaderSlide', module)
  .add('Basic', () => (
    <HeaderSlide
      image={image}
      level={LEVEL_TYPE.BASE}
      discipline="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ))
  .add('Advanced', () => (
    <HeaderSlide
      image={image}
      level={LEVEL_TYPE.ADVANCED}
      discipline="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ))
  .add('Coach', () => (
    <HeaderSlide
      image={image}
      level={LEVEL_TYPE.COACH}
      discipline="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ));
