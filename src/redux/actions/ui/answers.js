// @flow

import {
  validateAnswer as _validateAnswer,
  getQuestionType,
  getPreviousSlide
} from '@coorpacademy/player-store';

import type {StoreState} from '../../store';
import {
  isCorrect as _isCorrect,
  isGodModeEnabled,
  isFastSlideEnabled
} from '../../utils/state-extract';
import {ANALYTICS_EVENT_TYPE} from '../../../const';

export const validateAnswer: typeof _validateAnswer = () => async (dispatch, getState, options) => {
  const {services} = options;

  // $FlowFixMe getState definition conflict
  let state: StoreState = getState();

  const result = await _validateAnswer({
    godMode: isGodModeEnabled(state),
    fastSlide: isFastSlideEnabled(state)
  })(dispatch, getState, options);

  // $FlowFixMe getState definition conflict
  const newState: StoreState = getState();

  const previousSlide = getPreviousSlide(newState);
  const questionType = previousSlide && getQuestionType(previousSlide);
  const isCorrect = _isCorrect(newState);

  services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.VALIDATE_ANSWER, {
    questionType,
    isCorrect: typeof isCorrect === 'boolean' && Number(isCorrect)
  });
  await dispatch(result);
  // $FlowFixMe getState definition conflict
  return getState();
};

export default {
  validateAnswer
};
