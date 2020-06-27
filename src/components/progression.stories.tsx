import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Progression from './progression';

storiesOf('Progression', module).add('Default', () => <Progression current={1} total={10} />);
