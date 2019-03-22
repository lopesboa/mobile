// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Starbust from './starburst';

storiesOf('Starbust', module).add('Loose', () => <Starbust color="#e13f53" />);
storiesOf('Starbust', module).add('Win', () => <Starbust color="#3db379" />);
