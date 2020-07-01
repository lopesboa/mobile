import {createBrand} from '../../../__fixtures__/brands';
import {FETCH_SUCCESS, fetchSuccess} from '../../actions/brands';
import {SIGN_OUT} from '../../actions/authentication';
import type {Action} from '../../actions/brands';
import type {Action as AuthenticationAction} from '../../actions/authentication';
import reducer from './brand';
import type {State} from './brand';

describe('Cards', () => {
  const expectedInitialState: State = null;

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION',
    };
    // @ts-ignore we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  describe(FETCH_SUCCESS, () => {
    it('Default', () => {
      const brand = createBrand();
      const action: Action = fetchSuccess(brand);
      const result = reducer(undefined, action);
      const expected: State = brand;
      expect(result).toEqual(expected);
    });
  });
  describe(SIGN_OUT, () => {
    it('Default', () => {
      const action: AuthenticationAction = {type: SIGN_OUT};
      const result = reducer(undefined, action);
      const expected: State = expectedInitialState;
      expect(result).toEqual(expected);
    });
  });
});
