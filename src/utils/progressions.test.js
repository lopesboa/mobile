// @flow strict

import {ENGINE, CONTENT_TYPE} from '../const';
import {createProgression, createState} from '../__fixtures__/progression';
import {isDone} from './progressions';

it('isDone should detect if progression is done', () => {
  const progression = createProgression({
    engine: ENGINE.LEARNER,
    progressionContent: {ref: 'mod_1', type: CONTENT_TYPE.LEVEL}
  });

  expect(isDone({...progression, state: undefined})).toBe(false);
  expect(
    isDone({
      ...progression,
      state: createState({nextContent: {ref: 'sli_1', type: CONTENT_TYPE.SLIDE}})
    })
  ).toBe(false);
  expect(
    isDone({
      ...progression,
      state: createState({nextContent: {ref: 'ext_1', type: CONTENT_TYPE.NODE}})
    })
  ).toBe(false);

  expect(
    isDone({
      ...progression,
      state: createState({nextContent: {ref: 'success', type: CONTENT_TYPE.SUCCESS}})
    })
  ).toBe(true);
  expect(
    isDone({
      ...progression,
      state: createState({nextContent: {ref: 'failure', type: CONTENT_TYPE.FAILURE}})
    })
  ).toBe(true);
});
