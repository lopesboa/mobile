// @flow strict

import type {Choice} from '@coorpacademy/progression-engine';
import media from './media';

const choices: Array<Choice> = [
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
  label: index !== 1 ? choice.label : `${choice.label} with a portrait image`,
  media:
    index !== 1
      ? media
      : {
          ...media,
          url:
            'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwijhPuyoZPgAhWy34UKHR_RAX0QjRx6BAgBEAU&url=http%3A%2F%2Ffreesoftwaremagazine.com%2Farticles%2Fblender_foundation_big_buck_bunny_peach%2F&psig=AOvVaw2B33-_n-yj3Lc5jnb2xP0r&ust=1548860557455165'
        }
}));

export default choices;
