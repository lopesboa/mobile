import type {Choice} from '../types/coorpacademy/progression-engine';

import {image} from './medias';

export const choices: Array<Choice> = [
  {
    _id: '1',
    label: 'Play Store',
    value: 'play_store',
  },
  {
    _id: '2',
    label: 'App Store',
    value: 'app_store',
  },
  {
    _id: '3',
    label: 'Apple Store',
    value: 'apple_store',
  },
  {
    _id: '4',
    label: 'Pineapple Store',
    value: 'pineapple_store',
  },
];

export const choicesWithImage: Array<Choice> = choices.map((choice) => ({
  ...choice,
  media: image,
}));

export const createSelectChoice = ({name}: {name: string}): Choice => ({
  _id: '456',
  type: 'select',
  name,
  label: '',
  items: [
    {
      _id: '1',
      text: 'Play Store',
      value: 'play_store',
    },
    {
      _id: '2',
      text: 'App Store',
      value: 'app_store',
    },
    {
      _id: '3',
      text: 'Apple Store',
      value: 'apple_store',
    },
    {
      _id: '4',
      text: 'Pineapple Store',
      value: 'pineapple_store',
    },
  ],
});

export const createInputChoice = ({name}: {name: string}): Choice => ({
  _id: '123',
  name,
  label: '',
  type: 'text',
});

export default {
  choices,
  choicesWithImage,
  createInputChoice,
  createSelectChoice,
};
