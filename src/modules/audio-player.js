/* istanbul ignore file */

// @flow

import Sound from 'react-native-sound';

Sound.setCategory('Ambient');

type AudioFile = {
  WRONG_ANSWER: File,
  GOOD_ANSWER: File,
  FAILURE_LEVEL: File,
  SUCCESS_LEVEL: File
};

export const AUDIO_FILE: AudioFile = {
  WRONG_ANSWER: require('../assets/sounds/wrong-answer.mp3'),
  GOOD_ANSWER: require('../assets/sounds/good-answer.mp3'),
  FAILURE_LEVEL: require('../assets/sounds/failure-level.mp3'),
  SUCCESS_LEVEL: require('../assets/sounds/success-level.mp3')
};

const playSound = (soundFile: File) => {
  const callback = (error, sound) => {
    if (error) {
      return;
    }

    sound.play(() => {
      sound.release();
    });
  };

  const _player = new Sound(soundFile, error => callback(error, _player));
};

export default playSound;
