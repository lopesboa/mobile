// @flow strict

import type {QuestionChoiceItem} from '../types';
import media from './media';
import imagePortrait from './image-portrait-1.jpg';

const choices: Array<QuestionChoiceItem> = [
  {
    label: 'Play Store',
    value: 'play_store'
  },
  {
    label: 'App Store',
    value: 'app_store'
  },
  {
    label: 'Apple Store',
    value: 'apple_store'
  },
  {
    label: 'Pineapple Store',
    value: 'pineapple_store'
  }
];

export const choicesWithImage: Array<QuestionChoiceItem> = choices.map((choice, index) => ({
  ...choice,
  label: index !== 1 ? choice.label : `${choice.label} with a portrait image`,
  media:
    index !== 1
      ? media
      : {
          ...media,
          source: imagePortrait
        }
}));

export default choices;
