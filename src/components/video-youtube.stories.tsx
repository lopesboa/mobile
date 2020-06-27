import * as React from 'react';
import {storiesOf} from '@storybook/react-native';

import image from '../__fixtures__/assets/landscape-1.jpg';
import {handleFakePress} from '../utils/tests';
import VideoYoutube from './video-youtube';
import {STEP} from './video-overlay';

const videoId = 'K7g4WKoS_6U';

storiesOf('Video Youtube', module).add('Default', () => (
  <VideoYoutube
    id={videoId}
    preview={image}
    apiKey="7Hi5iS4f4k34P1K3Y"
    extralifeOverlay={false}
    height={180}
    step={STEP.PLAY}
    onPlay={handleFakePress}
    onRef={handleFakePress}
    onChangeState={handleFakePress}
    onError={handleFakePress}
    onChangeFullscreen={handleFakePress}
  />
));
