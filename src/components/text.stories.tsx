import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Text from './text';

storiesOf('Text', module).add('Default', () => <Text testID="basic-text">foo</Text>);
