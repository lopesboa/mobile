import {VALIDATE_ANSWER} from '../../actions/ui/answers';
import reducer from './answers';

describe('Answers', () => {
  it('handles default validating status', () => {
    const initialState = false;
    const action = {
      type: 'NOT_A_VALIDE_ACTION_TYPE',
      payload: true,
    };
    // @ts-ignore - not a matching Action
    const result = reducer(initialState, action);
    expect(result).toEqual(false);
  });

  it('handles validating status', () => {
    const initialState = false;
    const action = {
      type: VALIDATE_ANSWER,
      payload: true,
    };
    const result = reducer(initialState, action);
    expect(result).toEqual(true);
  });
});
