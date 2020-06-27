import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import {AUTHENTICATION_TYPE} from '../const';
import {handleFakePress} from '../utils/tests';
import AuthenticationDetails from './authentication-details';

storiesOf('AuthenticationDetails', module)
  .add('QR code', () => (
    <AuthenticationDetails
      type={AUTHENTICATION_TYPE.QR_CODE}
      onHelpPress={handleFakePress}
      onDemoPress={handleFakePress}
      onButtonPress={handleFakePress}
      onBack={handleFakePress}
    />
  ))
  .add('Magic link', () => (
    <AuthenticationDetails
      type={AUTHENTICATION_TYPE.MAGIC_LINK}
      onHelpPress={handleFakePress}
      onDemoPress={handleFakePress}
      onButtonPress={handleFakePress}
      onBack={handleFakePress}
    />
  ));
