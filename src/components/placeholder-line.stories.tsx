import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import PlaceholderLine from './placeholder-line';

storiesOf('PlaceholderLine', module)
  .add('Default', () => <PlaceholderLine />)
  .add('Small', () => <PlaceholderLine size="small" />)
  .add('Tiny', () => <PlaceholderLine size="tiny" />)
  .add('Custom color', () => <PlaceholderLine color="#000000" />)
  .add('Custom width', () => <PlaceholderLine width={30} />)
  .add('Centered', () => <PlaceholderLine width={30} isCentered />);
