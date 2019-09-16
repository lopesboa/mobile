// @flow strict

import {createEngineConfig} from '../__fixtures__/engine-config';
import {createStoreState, createDataState} from '../__fixtures__/store';
import {createLevel} from '../__fixtures__/levels';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createProgression} from '../__fixtures__/progression';
import {ENGINE, CONTENT_TYPE} from '../const';
import {mapStateToProps} from './clue';
import type {ConnectedStateProps} from './clue';

const slideRef = 'dummySlideRef';
const levelRef = 'dummyLevelRef';
const chapterId = '666';
const level = createLevel({ref: levelRef, chapterIds: [chapterId]});
const question = createQCMGraphic({});
const slide = createSlide({
  ref: slideRef,
  chapterId,
  question
});

describe('Clue', () => {
  it('should return the accurate props', () => {
    const progression = createProgression({
      _id: 'progression1',
      engine: ENGINE.LEARNER,
      progressionContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: slideRef
      },
      state: {
        nextContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: slideRef
        }
      }
    });

    const chapters = [];
    const disciplines = [];
    const levels = [level];
    const slides = [slide, slide];
    const store = createStoreState({
      levels,
      disciplines,
      chapters,
      slides,
      progression,
      data: createDataState({
        levels,
        slides,
        chapters,
        disciplines,
        progression,
        configs: {
          'learner@2': createEngineConfig()
        },
        clue: 'Whatever'
      })
    });

    const result = mapStateToProps(store);
    const expected: ConnectedStateProps = {
      header: question.header,
      clue: 'Whatever',
      slideId: slideRef,
      starsDiff: 42
    };

    expect(result).toEqual(expected);
  });
});
