// @flow

import * as React from 'react';
import Sound from 'react-native-sound';
import hoistNonReactStatic from 'hoist-non-react-statics';

Sound.setCategory('Ambient');

export const AUDIO_FILE: {
  ['WRONG_ANSWER' | 'GOOD_ANSWER' | 'FAILURE_LEVEL' | 'SUCCESS_LEVEL']: File
} = {
  WRONG_ANSWER: require('../assets/sounds/wrong-answer.mp3'),
  GOOD_ANSWER: require('../assets/sounds/good-answer.mp3'),
  FAILURE_LEVEL: require('../assets/sounds/failure-level.mp3'),
  SUCCESS_LEVEL: require('../assets/sounds/success-level.mp3')
};

export type Audio = {|
  AUDIO_FILE: typeof AUDIO_FILE,
  play: File => void
|};

export type WithAudioProps = {|
  audio: Audio
|};

function withAudio<P>(
  WrappedComponent: React$ComponentType<P>
): React$ComponentType<$Exact<{|...WithAudioProps, ...P|}>> {
  type Props = $Exact<{|
    ...P,
    ...WithAudioProps
  |}>;

  const audio: Audio = {
    AUDIO_FILE,
    play: (soundFile: File) => {
      const callback = (error, sound) => {
        if (error) {
          return;
        }

        sound.play(() => {
          sound.release();
        });
      };

      const player = new Sound(soundFile, error => callback(error, player));
    }
  };

  const ComponentWithAudio = (props: Props) => <WrappedComponent {...props} audio={audio} />;

  return hoistNonReactStatic(ComponentWithAudio, WrappedComponent);
}

export default withAudio;
