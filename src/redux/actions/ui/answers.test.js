// @flow

import {createProgression} from '../../../__fixtures__/progression';
import {createStoreState} from '../../../__fixtures__/store';
import {createFakeAnalytics} from '../../../utils/tests';
import {ANALYTICS_EVENT_TYPE, ENGINE, CONTENT_TYPE} from '../../../const';

const progression = createProgression({
  engine: ENGINE.LEARNER,
  progressionContent: {
    type: CONTENT_TYPE.SLIDE,
    ref: 'foobar'
  },
  state: {
    nextContent: {
      type: CONTENT_TYPE.SLIDE,
      ref: 'dummySlideRef'
    }
  }
});

const godMode = true;
const fastSlide = true;

const state = createStoreState({
  levels: [],
  disciplines: [],
  chapters: [],
  slides: [],
  progression,
  godMode,
  fastSlide
});

describe('Answers', () => {
  describe('validateAnswer', () => {
    jest.mock('@coorpacademy/player-store', () => {
      const {createTemplate} = require('../../../__fixtures__/questions');
      const {createSlide} = require('../../../__fixtures__/slides');

      const _question = createTemplate({title: 'Foobar'});
      const _slide = createSlide({ref: 'foo', chapterId: 'bar', question: _question});

      return {
        validateAnswer: jest.fn(() => () => Promise.resolve({})),
        getQuestionType: jest.fn(() => _question.type),
        getPreviousSlide: jest.fn(() => _slide)
      };
    });

    it('should log validation', async () => {
      const {validateAnswer: _validateAnswer} = require('@coorpacademy/player-store');

      const {validateAnswer} = require('./answers');

      const dispatch = jest.fn();
      const getState = jest.fn(() => state);

      const options = {
        services: {
          Analytics: createFakeAnalytics()
        }
      };

      // $FlowFixMe
      await validateAnswer()(dispatch, getState, options);

      expect(_validateAnswer).toHaveBeenCalledTimes(1);
      expect(_validateAnswer).toHaveBeenCalledWith({godMode, fastSlide});
      expect(options.services.Analytics.logEvent).toHaveBeenCalledWith(
        ANALYTICS_EVENT_TYPE.VALIDATE_ANSWER,
        {
          questionType: 'template',
          isCorrect: 1
        }
      );
    });
  });
});
