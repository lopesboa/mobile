// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import Pdf from './pdf';

// This is for the loader
if (process.env.NODE_ENV === 'test') {
  jest.useFakeTimers();
}

storiesOf('PDF', module).add('Remote', () => (
  <Pdf
    source={{
      uri:
        'https://s3.eu-west-1.amazonaws.com/static.coorpacademy.com/content/CoorpAcademy/content-bescherelle/cockpit-bescherelle/raw/former-un-adverbe-en-ment-1546614694171.pdf'
    }}
  />
));
