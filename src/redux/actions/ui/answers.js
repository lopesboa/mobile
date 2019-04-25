// @flow

import {
  validateAnswer as _validateAnswer,
  getQuestionType,
  getPreviousSlide
} from '@coorpacademy/player-store';

import {checkIsCorrect} from '../../utils/state-extract';
import {ANALYTICS_EVENT_TYPE} from '../../../const';

export const validateAnswer: typeof _validateAnswer = () => async (dispatch, getState, options) => {
  const {services} = options;
  const state: StoreState = getState();
  // $FlowFixMe
  const result = await _validateAnswer({godMode: state.godmode})(dispatch, getState, options);

  const previousSlide = getPreviousSlide(state);
  const questionType = previousSlide && getQuestionType(previousSlide);
  const isCorrect = checkIsCorrect(state);

  services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.VALIDATE_ANSWER, {
    questionType,
    isCorrect: Number(isCorrect)
  });

  return dispatch(result);
};

export default {
  validateAnswer
};
