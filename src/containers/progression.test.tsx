import {ENGINE, CONTENT_TYPE} from '../const';
import {createProgression, createState} from '../__fixtures__/progression';
import {createChapter} from '../__fixtures__/chapters';
import {createSlide} from '../__fixtures__/slides';
import {createQCM} from '../__fixtures__/questions';
import {createVideoState, createStoreState, createDataState} from '../__fixtures__/store';
import {mapStateToProps} from './progression';
import type {ConnectedStateProps} from './progression';

describe('Progression', () => {
  describe('mapStateToProps', () => {
    it('should return hidden true if video state has isFullScreen set to true', () => {
      const isFullScreen = true;
      const isValidating = false;
      const video = createVideoState({isFullScreen});

      const fakeState = createState({
        stars: 22,
        step: {
          current: 20,
        },
      });

      const qcm = createQCM({});

      const slide = createSlide({
        ref: 'sli_foo',
        chapterId: 'cha_1',
        question: qcm,
      });

      const chapter = createChapter({
        ref: 'cha_1',
        name: 'chapter',
        isConditional: false,
      });

      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'sli_foo',
        },
        state: fakeState,
      });
      const mockedStore = createStoreState({
        progression,
        video,
        isValidating,
        data: createDataState({
          chapters: [chapter],
          slides: [slide],
          progression,
        }),
      });

      const result = mapStateToProps(mockedStore);
      const expected: ConnectedStateProps = {
        isHidden: true,
        total: 0,
        current: 20,
        isLoading: false,
      };

      expect(result).toEqual(expected);
    });

    it('should return hidden true if progressionSteps is null', () => {
      const isFullScreen = false;
      const isValidating = false;
      const video = createVideoState({isFullScreen});

      const qcm = createQCM({});

      const slide = createSlide({
        ref: 'sli_foo',
        chapterId: 'cha_1',
        question: qcm,
      });

      const fakeState = createState({
        stars: 22,
        step: {
          current: 20,
        },
      });

      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'sli_foo',
        },
        state: fakeState,
      });

      const mockedStore = createStoreState({
        progression,
        video,
        isValidating,
        data: createDataState({
          chapters: [],
          slides: [slide],
          progression,
        }),
      });

      const result = mapStateToProps(mockedStore);
      const expected: ConnectedStateProps = {
        current: undefined,
        isHidden: true,
        isLoading: false,
        total: undefined,
      };

      expect(result).toEqual(expected);
    });

    it('should return hidden true if the content is an adaptive', () => {
      const isFullScreen = false;
      const isValidating = false;
      const video = createVideoState({isFullScreen});

      const qcm = createQCM({});

      const slide = createSlide({
        ref: 'sli_foo',
        chapterId: 'cha_1',
        question: qcm,
      });

      const fakeState = createState({
        stars: 22,
        step: {
          current: 20,
        },
      });

      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'sli_foo',
        },
        state: fakeState,
      });

      const chapter = createChapter({
        ref: 'cha_1',
        name: 'chapter',
        isConditional: true,
      });

      const mockedStore = createStoreState({
        progression,
        video,
        isValidating,
        data: createDataState({
          chapters: [chapter],
          slides: [slide],
          progression,
        }),
      });

      const result = mapStateToProps(mockedStore);
      const expected: ConnectedStateProps = {
        current: undefined,
        isHidden: true,
        isLoading: false,
        total: undefined,
      };

      expect(result).toEqual(expected);
    });
  });
});
