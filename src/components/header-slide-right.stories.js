// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import HeaderSlideRight from './header-slide-right';

storiesOf('HeaderSlideRight', module)
  .add('Default', () => <HeaderSlideRight isGodMode={false} onGodModeToggle={null} count={3} />)
  .add('God mode', () => (
    <HeaderSlideRight isGodMode onGodModeToggle={handleFakePress} count={3} />
  ));
