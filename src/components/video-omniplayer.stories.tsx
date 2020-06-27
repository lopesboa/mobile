import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import VideoOmniPlayer from './video-omniplayer';

const videoId = '5e6126fdbe444d66709afab1';

storiesOf('Video OmniPlayer', module)
  .add('Default', () => (
    <VideoOmniPlayer
      type="video"
      source={{uri: `https://mms.myomni.live/${videoId}`}}
      thumbnail="https://www.cerema.fr/sites/default/files/styles/uas_normal/public/media/images/2017/11/mountain-village-2657307_1920.jpg?h=d6fbcf4a&itok=JMWt0SsS"
      height={200}
    />
  ))
  .add('Without Thumbnail', () => (
    <VideoOmniPlayer
      type="video"
      source={{uri: `https://mms.myomni.live/${videoId}`}}
      height={200}
    />
  ));
