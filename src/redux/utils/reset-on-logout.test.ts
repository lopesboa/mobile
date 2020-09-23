import resetOnLogout, {SIGN_OUT} from './reset-on-logout';

it('resetOnLogout', () => {
  const INITIAL_VALUE = 0;
  const INCREMENT = {type: 'INCREMENT'};
  const counter = (state: number = INITIAL_VALUE, action: {type: string}) => {
    switch ((action && action.type) || '') {
      case INCREMENT.type: {
        return state + 1;
      }
      default: {
        return state;
      }
    }
  };

  const reducer = resetOnLogout(counter);

  expect(reducer(1, INCREMENT)).toBe(2);
  expect(reducer(1, {type: SIGN_OUT})).toBe(0);
  expect(reducer(INITIAL_VALUE, {type: SIGN_OUT})).toBe(0);
});
