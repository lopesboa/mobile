// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import image from '../__fixtures__/assets/landscape-3.jpg';

import {RESOURCE_TYPE} from '../const';
import {handleFakePress} from '../utils/tests';
import Preview from './preview';

storiesOf('Preview', module)
  .add('Video Remote', () => (
    <Preview type={RESOURCE_TYPE.VIDEO} source={image} onPress={handleFakePress} />
  ))
  .add('PDF Remote', () => (
    <Preview
      type={RESOURCE_TYPE.PDF}
      source={{
        uri: 'https://assets-jpcust.jwpsrv.com/thumbnails/2ad64hgq-720.jpg'
      }}
      onPress={handleFakePress}
    />
  ));
