// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import image from '../__fixtures__/image-landscape-3.jpg';

import {RESSOURCE_TYPE} from '../const';
import Preview from './preview';

// eslint-disable-next-line no-console
const handleButtonPress = () => console.log('Clicked');

storiesOf('Preview', module)
  .add('Video Remote', () => (
    <Preview type={RESSOURCE_TYPE.VIDEO} source={image} onPress={handleButtonPress} />
  ))
  .add('PDF Remote', () => (
    <Preview
      type={RESSOURCE_TYPE.PDF}
      source={{uri: 'https://assets-jpcust.jwpsrv.com/thumbnails/2ad64hgq-720.jpg'}}
      onPress={handleButtonPress}
    />
  ));
