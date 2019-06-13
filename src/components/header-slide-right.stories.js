// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import HeaderSlideRight from './header-slide-right';

storiesOf('HeaderSlideRight', module)
  .add('Default', () => (
    <HeaderSlideRight
      isGodModeActivated={false}
      isFastSlideActivated={false}
      onFastSlideToggle={handleFakePress}
      onGodModeToggle={null}
      count={3}
    />
  ))
  .add('God mode', () => (
    <HeaderSlideRight
      isGodModeActivated
      isFastSlideActivated={false}
      onFastSlideToggle={handleFakePress}
      onGodModeToggle={handleFakePress}
      count={3}
    />
  ))
  .add('FastSlide', () => (
    <HeaderSlideRight
      isGodModeActivated={false}
      isFastSlideActivated
      onFastSlideToggle={handleFakePress}
      onGodModeToggle={handleFakePress}
      count={3}
    />
  ));
