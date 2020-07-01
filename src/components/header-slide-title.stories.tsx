import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import HeaderSlideTitle from './header-slide-title';

storiesOf('HeaderSlideTitle', module)
  .add('Default', () => <HeaderSlideTitle />)
  .add('Basic', () => (
    <HeaderSlideTitle
      image={{
        uri:
          'https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg',
      }}
      subtitle="Basic"
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ))
  .add('Advanced', () => (
    <HeaderSlideTitle
      image={{
        uri:
          'https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg',
      }}
      subtitle="Advanced"
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ))
  .add('Coach', () => (
    <HeaderSlideTitle
      image={{
        uri:
          'https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg',
      }}
      subtitle="Coach"
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus."
    />
  ));
