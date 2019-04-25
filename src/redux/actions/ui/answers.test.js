// @flow

import {createFakeAnalytics} from '../../../utils/tests';
import {ANALYTICS_EVENT_TYPE} from '../../../const';

describe('Answers', () => {
  describe('validateAnswer', () => {
    it('should log validation', async () => {
      jest.mock('../../utils/state-extract', () => ({
        checkIsCorrect: jest.fn(() => true)
      }));
      jest.mock('@coorpacademy/player-store', () => ({
        validateAnswer: jest.fn(() => () => Promise.resolve({})),
        getQuestionType: jest.fn(() => 'template'),
        getPreviousSlide: jest.fn(() => ({}))
      }));
      const {validateAnswer: _validateAnswer} = require('@coorpacademy/player-store');

      const {validateAnswer} = require('./answers');

      const dispatch = jest.fn();
      const getState = jest.fn();
      getState.mockReturnValue({
        godmode: {isGodMode: false}
      });
      const options = {
        services: {
          Analytics: createFakeAnalytics()
        }
      };

      // $FlowFixMe
      await validateAnswer({godMode: false})(dispatch, getState, options);

      expect(_validateAnswer).toHaveBeenCalled();
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
