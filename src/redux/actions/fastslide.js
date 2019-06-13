// @flow

export const TOGGLE_FAST_SLIDE = '@@fastSlide/TOGGLE_FAST_SLIDE';
export type Action = {|type: '@@fastSlide/TOGGLE_FAST_SLIDE', payload: boolean|};

type ToggleFastSlide = () => Action;

export const toggleFastSlide = () => (
  dispatch: Dispatch,
  getState: GetState
): ToggleFastSlide | null => {
  const state = getState();
  if (state.authentication.user.isGodModeUser)
    return () => dispatch({type: TOGGLE_FAST_SLIDE, payload: !state.fastSlide});
  return null;
};
