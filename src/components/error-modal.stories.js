// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {View} from 'react-native';
import {handleFakePress} from '../utils/tests';

import {ERROR_TYPE} from '../const';
import ErrorModal from './error-modal';

storiesOf('ErrorModal', module)
  .add('No Content Found case', () => (
    <View>
      <ErrorModal
        type={ERROR_TYPE.NO_CONTENT_FOUND}
        onPress={handleFakePress}
        onAssistancePress={handleFakePress}
        onClose={handleFakePress}
      />
    </View>
  ))
  .add('Platform not activated case', () => (
    <View>
      <ErrorModal
        type={ERROR_TYPE.PLATFORM_NOT_ACTIVATED}
        onPress={handleFakePress}
        onClose={handleFakePress}
        onAssistancePress={handleFakePress}
      />
    </View>
  ));
