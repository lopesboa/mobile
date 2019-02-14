// @flow

import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import HeaderSlideTitle from './header-slide-title';

storiesOf('HeaderSlideTitle', module)
  .add('Basic', () => (
    <HeaderSlideTitle
      image={{uri: 'https://assets-jpcust.jwpsrv.com/thumbnails/2ad64hgq-720.jpg'}}
      subtitle="Basic"
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ))
  .add('Advanced', () => (
    <HeaderSlideTitle
      image={{uri: 'https://assets-jpcust.jwpsrv.com/thumbnails/2ad64hgq-720.jpg'}}
      subtitle="Advanced"
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ))
  .add('Coach', () => (
    <HeaderSlideTitle
      image={{uri: 'https://assets-jpcust.jwpsrv.com/thumbnails/2ad64hgq-720.jpg'}}
      subtitle="Coach"
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ));
