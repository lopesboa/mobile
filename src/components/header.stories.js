// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {handleFakePress} from '../utils/tests';
import {Header} from './header';

const navigation = {goBack: handleFakePress};

storiesOf('Header', module)
  .add('Light', () => <Header navigation={navigation} isDarkModeActivated={false} />)
  .add('Dark', () => <Header navigation={navigation} isDarkModeActivated />);
