// @flow strict

import {createEngineConfig} from '../__fixtures__/engine-config';
import {createStoreState, createDataState} from '../__fixtures__/store';
import {createVideo, createPdf} from '../__fixtures__/lessons';
import {createLevel} from '../__fixtures__/levels';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createProgression} from '../__fixtures__/progression';
import {mapToResource} from '../layer/data/mappers';
import {ENGINE, CONTENT_TYPE} from '../const';
import {mapStateToProps} from './lesson';
import type {ConnectedStateProps} from './lesson';

const slideRef = 'dummySlideRef';
const levelRef = 'dummyLevelRef';
const chapterId = '666';

const video = createVideo({ref: 'foo'});
const pdf = createPdf({ref: 'bar'});

const level = createLevel({ref: levelRef, chapterIds: [chapterId]});
const question = createQCMGraphic({});
const lessons = [video, pdf];

const slide = createSlide({
  ref: slideRef,
  chapterId,
  question,
  lessons
});

describe('Lesson', () => {
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
    const slides = [slide];
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
        }
      })
    });

    const result = mapStateToProps(store);
    const expected: ConnectedStateProps = {
      header: question.header,
      resources: slide.lessons.map(mapToResource).filter(lesson => lesson.url),
      currentResource: 'foo',
      starsGranted: 1337
    };

    expect(result).toEqual(expected);
  });
});
