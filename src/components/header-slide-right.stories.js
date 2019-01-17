// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import HeaderSlideRight from './header-slide-right';

storiesOf('HeaderSlideRight', module).add('Default', () => <HeaderSlideRight count={3} />);
