// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {TOOLTIP_TYPE} from '../const';
import Tooltip from './tooltip';

storiesOf('Tooltip', module)
  .add('Tooltip HighScore', () => (
    <Tooltip
      type={TOOLTIP_TYPE.HIGHSCORE}
      text="You have a new highscore<br><b>you just won +17 stars</b>"
    />
  ))
  .add('Tooltip Unlocked', () => (
    <Tooltip type={TOOLTIP_TYPE.UNLOCK} text="You have just unlocked<br><b>coach level</b>" />
  ));
