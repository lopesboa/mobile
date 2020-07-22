import {
  validateAnswer as _validateAnswer,
  getQuestionType,
  getPreviousSlide,
} from '@coorpacademy/player-store';

import type {StoreState} from '../../store';
import {
  isCorrect as _isCorrect,
  isGodModeEnabled,
  isFastSlideEnabled,
} from '../../utils/state-extract';
import {ANALYTICS_EVENT_TYPE} from '../../../const';

export const VALIDATE_ANSWER = '@@answer/VALIDATE_ANSWER';

export type Action = {
  type: '@@answer/VALIDATE_ANSWER';
  payload: boolean;
};

export const changeAnswerValidationStatus = (isValidating: boolean): Action => ({
  type: VALIDATE_ANSWER,
  payload: isValidating,
});

export const validateAnswer: typeof _validateAnswer = () => async (dispatch, getState, options) => {
  const {services} = options;

  dispatch(changeAnswerValidationStatus(true));

  // @ts-ignore getState definition conflict
  const state: StoreState = getState();

  const result = await _validateAnswer({
    godMode: isGodModeEnabled(state),
    fastSlide: isFastSlideEnabled(state),
  })(dispatch, getState, options);

  // @ts-ignore getState definition conflict
  const newState: StoreState = getState();

  const previousSlide = getPreviousSlide(newState);
  const questionType = previousSlide && getQuestionType(previousSlide);
  const isCorrect = _isCorrect(newState);

  services.Analytics.logEvent(ANALYTICS_EVENT_TYPE.VALIDATE_ANSWER, {
    questionType,
    isCorrect: typeof isCorrect === 'boolean' && Number(isCorrect),
  });
  await dispatch(result);
  await dispatch(changeAnswerValidationStatus(false));

  // @ts-ignore getState definition conflict
  return getState();
};

export default {
  validateAnswer,
};
