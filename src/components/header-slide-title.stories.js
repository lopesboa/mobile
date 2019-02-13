// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import image from '../__fixtures__/assets/landscape-3.jpg';
import {LEVEL_TYPE} from '../const';
import HeaderSlideTitle from './header-slide-title';

storiesOf('HeaderSlideTitle', module)
  .add('Basic', () => (
    <HeaderSlideTitle
      image={image}
      level={LEVEL_TYPE.BASE}
      discipline="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ))
  .add('Advanced', () => (
    <HeaderSlideTitle
      image={image}
      level={LEVEL_TYPE.ADVANCED}
      discipline="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ))
  .add('Coach', () => (
    <HeaderSlideTitle
      image={image}
      level={LEVEL_TYPE.COACH}
      discipline="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ));
