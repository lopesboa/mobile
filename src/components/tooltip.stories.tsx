import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {TOOLTIP_TYPE} from '../const';
import Tooltip from './tooltip';

storiesOf('Tooltip', module)
  .add('Highscore', () => <Tooltip type={TOOLTIP_TYPE.HIGHSCORE}>Foo bar</Tooltip>)
  .add('Unlock', () => <Tooltip type={TOOLTIP_TYPE.UNLOCK}>Foo bar</Tooltip>);
