import {NavigationScreenProp} from 'react-navigation';

// @todo to be enhanced, incomplete object
export const createNavigation = <T>({params}: {params?: T}): NavigationScreenProp<T> => ({
  state: {
    params,
  },
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  getParam: jest.fn(() => 'Mock$ReactNavigation$GetParam'),
  popToTop: jest.fn(),
});
