// @flow strict

import {createStoreState} from '../__fixtures__/store';
import {createLevel} from '../__fixtures__/levels';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createProgression} from '../__fixtures__/progression';
import {createContextWithImage} from '../__fixtures__/context';
import {ENGINE, CONTENT_TYPE} from '../const';
import {mapStateToProps} from './context';
import type {ConnectedStateProps} from './context';

const slideRef = 'dummySlideRef';
const levelRef = 'dummyLevelRef';
const chapterId = '666';
const level = createLevel({ref: levelRef, chapterIds: [chapterId]});
const question = createQCMGraphic({});
const context = createContextWithImage({title: 'A beautifull rainy day'});
const slide = createSlide({
  ref: slideRef,
  chapterId,
  question,
  context
});

describe('Context', () => {
  it('should return the accurate props', () => {
    const progression = createProgression({
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

    const mockedStore = createStoreState({
      levels: [level],
      disciplines: [],
      chapters: [],
      slides: [slide, slide],
      progression
    });

    const result = mapStateToProps(mockedStore);
    const expected: ConnectedStateProps = {
      description: context.description,
      header: context.title,
      media: context.media
    };
    expect(result).toEqual(expected);
  });

  it('should return default props', () => {
    const progression = createProgression({
      engine: ENGINE.LEARNER,
      progressionContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: slideRef
      }
    });
    const emptyStore = createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression
    });

    const result = mapStateToProps(emptyStore);
    const expected: ConnectedStateProps = {
      description: undefined,
      header: undefined,
      media: undefined
    };
    expect(result).toEqual(expected);
  });
});
