import * as React from 'react';
import {addDecorator, storiesOf} from '@storybook/react-native';
import {linkTo} from '@storybook/addon-links';

import CenterView from './components/center-view';
import Welcome from './components/welcome';

addDecorator(CenterView);

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('default')} />);

require('../../src/stories.ts');
