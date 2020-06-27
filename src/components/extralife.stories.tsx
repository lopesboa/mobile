import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import ExtraLife from './extralife';

storiesOf('Extralife', module).add('Default', () => <ExtraLife count={1} />);
