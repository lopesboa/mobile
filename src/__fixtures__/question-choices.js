// @flow strict

import type {Choice} from '@coorpacademy/progression-engine';

import {image} from './medias';

export const choices: Array<Choice> = [
  {
    _id: '1',
    label: 'Play Store',
    value: 'play_store'
  },
  {
    _id: '2',
    label: 'App Store',
    value: 'app_store'
  },
  {
    _id: '3',
    label: 'Apple Store',
    value: 'apple_store'
  },
  {
    _id: '4',
    label: 'Pineapple Store',
    value: 'pineapple_store'
  }
];

export const choicesWithImage: Array<Choice> = choices.map((choice, index) => ({
  ...choice,
  media: image
}));

export default {
  choices,
  choicesWithImage
};
