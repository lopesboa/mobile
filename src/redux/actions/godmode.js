// @flow

export const TOGGLE_GOD_MODE = '@@godmode/TOGGLE_GOD_MODE';
export type Action = {|type: '@@godmode/TOGGLE_GOD_MODE', payload: boolean|};

type ToggleGodMode = () => Action;

export const toggleGodMode = () => (
  dispatch: Dispatch,
  getState: GetState
): ToggleGodMode | null => {
  const state = getState();
  if (state.authentication.user.isGodModeUser)
    return () => dispatch({type: TOGGLE_GOD_MODE, payload: !state.godmode});
  return null;
};
