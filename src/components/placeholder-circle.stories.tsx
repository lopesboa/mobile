import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import PlaceholderCircle from './placeholder-circle';

storiesOf('PlaceholderCircle', module).add('Default', () => <PlaceholderCircle width={20} />);
