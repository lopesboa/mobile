// @flow strict

import {selectProgression, getCurrentProgressionId} from '@coorpacademy/player-store';

export {selectProgression};

export const selectCurrentProgression = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const progressionId = getCurrentProgressionId(state);

  if (progressionId) {
    // $FlowFixMe
    dispatch(selectProgression(progressionId));
  }
};
